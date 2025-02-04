import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Comment } from "../../entities/comment.entity"
import { Post } from "../../entities/post.entity"
import { CommentsController } from "./comments.controller"
import { CommentsService } from "./comments.service"
import { MailModule } from "../mail/mail.module"
import { AuthModule } from "../auth/auth.module"

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Post]), MailModule, AuthModule],
    controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService],
})
export class CommentsModule {}
