import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    ParseIntPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common"
import { CommentsService } from "./comments.service"
import { CommentCreateDto } from "./dto/comment-create.dto"
import { CommentUpdateDto } from "./dto/comment-update.dto"
import { CommentResponseDto } from "./dto/comment-response.dto"
import { JwtGuard } from "../auth/guards/jwt.guard"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { User } from "../../entities/user.entity"

@Controller("posts/:postId/comments")
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get()
    findByPost(@Param("postId", ParseIntPipe) postId: number): Promise<CommentResponseDto[]> {
        return this.commentsService.findByPost(postId)
    }

    @Post()
    @UseGuards(JwtGuard)
    create(
        @Param("postId", ParseIntPipe) postId: number,
        @Body() createCommentDto: CommentCreateDto,
        @CurrentUser() user: User,
    ): Promise<CommentResponseDto> {
        return this.commentsService.create(postId, createCommentDto, user)
    }

    @Put(":id")
    @UseGuards(JwtGuard)
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateCommentDto: CommentUpdateDto,
        @CurrentUser() user: User,
    ): Promise<CommentResponseDto> {
        return this.commentsService.update(id, updateCommentDto, user)
    }

    @Delete(":id")
    @UseGuards(JwtGuard)
    remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User): Promise<void> {
        return this.commentsService.remove(id, user)
    }
}
