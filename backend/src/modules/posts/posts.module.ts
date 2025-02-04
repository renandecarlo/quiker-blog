import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Post } from "../../entities/post.entity"
import { PostsController } from "./posts.controller"
import { PostsService } from "./posts.service"
import { StorageModule } from "../storage/storage.module"
import { PostInteraction } from "../../entities/post-interaction.entity"
import { AuthModule } from "../auth/auth.module"
import { PostHistory } from "../../entities/post-history.entity"

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostInteraction, PostHistory]), StorageModule, AuthModule],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule {}
