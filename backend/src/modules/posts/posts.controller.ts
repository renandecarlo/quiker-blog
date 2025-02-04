import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    ParseIntPipe,
    BadRequestException,
    UseInterceptors,
    ClassSerializerInterceptor,
    Ip,
} from "@nestjs/common"
import { PostsService } from "./posts.service"
import { PostCreateDto } from "./dto/post-create.dto"
import { PostUpdateDto } from "./dto/post-update.dto"
import { PostResponseDto } from "./dto/post-response.dto"
import { JwtGuard } from "../auth/guards/jwt.guard"

@Controller("posts")
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async findAll(@Ip() ip: string): Promise<PostResponseDto[]> {
        return this.postsService.findAll(ip)
    }

    @Get("report")
    async getStats() {
        return this.postsService.getPostReport()
    }

    @Post()
    @UseGuards(JwtGuard)
    async create(@Body() createPostDto: PostCreateDto, @Request() req): Promise<PostResponseDto> {
        return this.postsService.create(createPostDto, req.user.id)
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number, @Ip() ip: string): Promise<PostResponseDto> {
        return this.postsService.findOne(id, ip)
    }

    @Patch(":id")
    @UseGuards(JwtGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updatePostDto: PostUpdateDto,
        @Request() req,
    ): Promise<PostResponseDto> {
        return this.postsService.update(id, updatePostDto, req.user.id)
    }

    @Delete(":id")
    @UseGuards(JwtGuard)
    async remove(@Param("id", ParseIntPipe) id: number, @Request() req) {
        await this.postsService.remove(id, req.user.id)
        return { message: "Post removido com sucesso" }
    }

    @Post(":id/like")
    @UseGuards(JwtGuard)
    async like(@Param("id", ParseIntPipe) id: number, @Ip() ip: string) {
        return this.postsService.like(id, ip)
    }

    @Post(":id/dislike")
    @UseGuards(JwtGuard)
    async dislike(@Param("id", ParseIntPipe) id: number, @Ip() ip: string) {
        return this.postsService.dislike(id, ip)
    }

    @Post("upload-url")
    @UseGuards(JwtGuard)
    async generateUploadUrl(@Body("fileName") fileName: string, @Body("contentType") contentType: string) {
        if (!fileName || !contentType) {
            throw new BadRequestException("Nome do arquivo e tipo de conteúdo são obrigatórios")
        }
        const url = await this.postsService.generateUploadUrl(fileName, contentType)
        return { url }
    }
}
