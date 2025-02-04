import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, IsNull } from "typeorm"
import { Comment } from "../../entities/comment.entity"
import { Post } from "../../entities/post.entity"
import { User } from "../../entities/user.entity"
import { CommentCreateDto } from "./dto/comment-create.dto"
import { CommentUpdateDto } from "./dto/comment-update.dto"
import { CommentResponseDto } from "./dto/comment-response.dto"
import { MailService } from "../mail/mail.service"
import { plainToInstance } from "class-transformer"

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly mailService: MailService,
    ) {}

    private toResponseDto(comment: Comment): CommentResponseDto {
        const responseDto = plainToInstance(CommentResponseDto, {
            ...comment,
            content: comment.deletedAt ? null : comment.content,
            userName: comment.user.name,
        })
        return responseDto
    }

    async findByPost(postId: number): Promise<CommentResponseDto[]> {
        const comments = await this.commentRepository.find({
            where: {
                post: { id: postId },
            },
            relations: ["user"],
            order: { createdAt: "DESC" },
        })

        return comments.map((comment) => this.toResponseDto(comment))
    }

    async create(postId: number, createCommentDto: CommentCreateDto, user: User): Promise<CommentResponseDto> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ["user"],
        })

        if (!post) {
            throw new NotFoundException("Post não encontrado")
        }

        const comment = this.commentRepository.create({
            ...createCommentDto,
            post,
            user,
        })

        const savedComment = await this.commentRepository.save(comment)

        // Envia notificação por email apenas se o autor do comentário não for o autor do post
        if (user.id !== post.user.id) {
            await this.mailService.sendNewCommentNotification(post, savedComment)
        }

        return this.toResponseDto(savedComment)
    }

    async update(id: number, updateCommentDto: CommentUpdateDto, user: User): Promise<CommentResponseDto> {
        const comment = await this.commentRepository.findOne({
            where: {
                id,
                deletedAt: IsNull(),
            },
            relations: ["user"],
        })

        if (!comment || comment.user.id !== user.id) {
            throw new NotFoundException("Comentário não encontrado")
        }

        Object.assign(comment, updateCommentDto)
        const updatedComment = await this.commentRepository.save(comment)
        return this.toResponseDto(updatedComment)
    }

    async remove(id: number, user: User): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: {
                id,
                deletedAt: IsNull(),
            },
            relations: ["user", "post.user"],
        })

        // Permite que tanto o autor do comentário quanto o autor do post possam deletar
        if (!comment || (comment.user.id !== user.id && comment.post.user.id !== user.id)) {
            throw new NotFoundException("Comentário não encontrado")
        }

        // Soft deletion - apenas marca como deletado
        comment.deletedAt = new Date()
        await this.commentRepository.save(comment)
    }
}
