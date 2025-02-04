import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Post } from "../../entities/post.entity"
import { PostInteraction } from "../../entities/post-interaction.entity"
import { PostHistory } from "../../entities/post-history.entity"
import { PostCreateDto } from "./dto/post-create.dto"
import { PostUpdateDto } from "./dto/post-update.dto"
import { PostResponseDto } from "./dto/post-response.dto"
import { PostReportDto } from "./dto/post-report.dto"
import { StorageService } from "../storage/storage.service"
import { plainToInstance } from "class-transformer"

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(PostInteraction)
        private readonly interactionRepository: Repository<PostInteraction>,
        @InjectRepository(PostHistory)
        private readonly postHistoryRepository: Repository<PostHistory>,
        private readonly storageService: StorageService,
    ) {}

    // Limita os dados para API pública
    private toResponseDto(post: Post, ip: string): PostResponseDto {
        const interaction = post.interactions?.find((i) => i.ipAddress === ip)
        return plainToInstance(PostResponseDto, {
            ...post,
            userName: post.user.name,
            history: post.history?.map((h) => ({
                title: h.title,
                content: h.content,
                createdAt: h.createdAt,
            })),
            comments: post.comments?.map((c) => ({
                id: c.id,
                content: c.deletedAt ? null : c.content,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
                deletedAt: c.deletedAt,
                userName: c.user.name,
            })),
            userInteraction: {
                hasViewed: interaction?.hasViewed ?? false,
                hasLiked: interaction?.hasLiked ?? false,
                hasDisliked: interaction?.hasDisliked ?? false,
            },
        })
    }

    private async getOrCreateInteraction(postId: number, ip: string): Promise<PostInteraction> {
        const query = this.interactionRepository
            .createQueryBuilder("interaction")
            .where("interaction.postId = :postId", { postId })
            .andWhere("interaction.ipAddress = :ipAddress", { ipAddress: ip })

        let interaction = await query.getOne()

        if (!interaction) {
            const newInteraction = new PostInteraction()
            newInteraction.postId = postId
            newInteraction.ipAddress = ip

            interaction = await this.interactionRepository.save(newInteraction)
        }

        return interaction
    }

    async recordView(postId: number): Promise<void> {
        const post = await this.postRepository.findOne({ where: { id: postId } })
        if (!post) {
            throw new NotFoundException("Post não encontrado")
        }

        // Incrementa viewCount
        await this.postRepository.update(postId, {
            viewCount: () => "viewCount + 1",
        })
    }

    async like(postId: number, ip: string) {
        if (!ip) {
            throw new UnauthorizedException("Usuário não autenticado")
        }

        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ["interactions"],
        })
        if (!post) {
            throw new NotFoundException("Post não encontrado")
        }

        // Busca ou cria a interação do usuário
        const interaction = await this.getOrCreateInteraction(postId, ip)

        // Se já curtiu, remove a curtida
        if (interaction.hasLiked) {
            await this.postRepository.update(postId, {
                likeCount: () => "likeCount - 1",
            })
            interaction.hasLiked = false
        }
        // Se descurtiu, remove o descurtir e adiciona a curtida
        else if (interaction.hasDisliked) {
            await this.postRepository.update(postId, {
                likeCount: () => "likeCount + 1",
                dislikeCount: () => "dislikeCount - 1",
            })
            interaction.hasLiked = true
            interaction.hasDisliked = false
        }
        // Se não tem interação, adiciona a curtida
        else {
            await this.postRepository.update(postId, {
                likeCount: () => "likeCount + 1",
            })
            interaction.hasLiked = true
        }

        await this.interactionRepository.save(interaction)

        const updatedPost = await this.postRepository.findOne({
            where: { id: postId },
            relations: ["user", "interactions"],
        })

        if (!updatedPost) {
            throw new NotFoundException("Post não encontrado após atualização")
        }

        return this.toResponseDto(updatedPost, ip)
    }

    async dislike(postId: number, ip: string) {
        if (!ip) {
            throw new UnauthorizedException("Usuário não autenticado")
        }

        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ["interactions"],
        })
        if (!post) {
            throw new NotFoundException("Post não encontrado")
        }

        // Busca ou cria a interação do usuário
        const interaction = await this.getOrCreateInteraction(postId, ip)

        // Se já descurtiu, remove a descurtida
        if (interaction.hasDisliked) {
            await this.postRepository.update(postId, {
                dislikeCount: () => "dislikeCount - 1",
            })
            interaction.hasDisliked = false
        }
        // Se curtiu, remove a curtida e adiciona a descurtida
        else if (interaction.hasLiked) {
            await this.postRepository.update(postId, {
                likeCount: () => "likeCount - 1",
                dislikeCount: () => "dislikeCount + 1",
            })
            interaction.hasLiked = false
            interaction.hasDisliked = true
        }
        // Se não tem interação, adiciona a descurtida
        else {
            await this.postRepository.update(postId, {
                dislikeCount: () => "dislikeCount + 1",
            })
            interaction.hasDisliked = true
        }

        await this.interactionRepository.save(interaction)

        const updatedPost = await this.postRepository.findOne({
            where: { id: postId },
            relations: ["user", "interactions"],
        })

        if (!updatedPost) {
            throw new NotFoundException("Post não encontrado após atualização")
        }

        return this.toResponseDto(updatedPost, ip)
    }

    async create(createPostDto: PostCreateDto, userId: number): Promise<PostResponseDto> {
        const post = this.postRepository.create({
            ...createPostDto,
            userId,
        })
        const savedPost = await this.postRepository.save(post)

        // Carrega o post com a relação de usuário para o DTO
        const postWithUser = await this.postRepository.findOne({
            where: { id: savedPost.id },
            relations: ["user"],
        })

        if (!postWithUser) {
            throw new NotFoundException("Post não encontrado após criação")
        }

        return this.toResponseDto(postWithUser, "")
    }

    async findAll(ip: string): Promise<PostResponseDto[]> {
        if (!ip) {
            throw new UnauthorizedException("Usuário não autenticado")
        }

        const posts = await this.postRepository.find({
            relations: ["user", "comments", "comments.user", "interactions", "history"],
            order: { createdAt: "DESC" },
        })

        return posts.map((post) => this.toResponseDto(post, ip))
    }

    async findOne(id: number, ip: string): Promise<PostResponseDto> {
        if (!ip) {
            throw new UnauthorizedException("Usuário não autenticado")
        }

        const post = await this.postRepository.findOne({
            where: { id },
            relations: ["user", "comments", "comments.user", "interactions", "history"],
        })

        if (!post) {
            throw new NotFoundException("Post não encontrado")
        }

        // Registra visualização
        await this.recordView(id)

        return this.toResponseDto(post, ip)
    }

    async findPostEntity(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
        })

        if (!post) throw new NotFoundException("Post não encontrado")

        return post
    }

    async update(id: number, updatePostDto: PostUpdateDto, userId: number): Promise<PostResponseDto> {
        const post = await this.findPostEntity(id)
        if (!post) {
            throw new NotFoundException("Post não encontrado")
        }

        if (post.userId !== userId) {
            throw new UnauthorizedException("Você não tem permissão para editar este post")
        }

        // Cria registro de histórico se houver mudanças
        if (updatePostDto.title !== post.title || updatePostDto.content !== post.content) {
            const history = new PostHistory()
            history.postId = post.id
            history.title = post.title
            history.content = post.content
            await this.postHistoryRepository.save(history)
        }

        // Remove a imagem do storage se for atualizada
        if (post.coverImage && updatePostDto.coverImage && post.coverImage !== updatePostDto.coverImage) {
            await this.storageService.deleteObject(post.coverImage)
        }

        // Atualiza o post
        Object.assign(post, updatePostDto)
        const updatedPost = await this.postRepository.save(post)

        // Carrega o post com a relação de usuário para o DTO
        const postWithUser = await this.postRepository.findOne({
            where: { id: updatedPost.id },
            relations: ["user"],
        })

        if (!postWithUser) {
            throw new NotFoundException("Post não encontrado após atualização")
        }

        return this.toResponseDto(postWithUser, "")
    }

    async remove(id: number, userId: number): Promise<void> {
        const post = await this.findPostEntity(id)
        if (!post) {
            throw new NotFoundException("Post não encontrado")
        }

        if (post.userId !== userId) {
            throw new UnauthorizedException("Você não tem permissão para deletar este post")
        }

        await this.postRepository.remove(post)
    }

    async generateUploadUrl(fileName: string, contentType: string): Promise<string> {
        if (!fileName || !contentType) {
            throw new BadRequestException("Nome do arquivo e tipo de conteúdo são obrigatórios")
        }

        return await this.storageService.generatePresignedUrl(fileName, contentType)
    }

    // Retorna o relatório de todos os posts
    async getPostReport(): Promise<PostReportDto[]> {
        const posts = await this.postRepository.find({
            relations: ["comments"],
        })

        return posts.map((post) => ({
            title: post.title,
            commentsCount: post.comments?.length || 0,
            viewsCount: post.viewCount,
            likesCount: post.likeCount,
            dislikesCount: post.dislikeCount,
        }))
    }
}
