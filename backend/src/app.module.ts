import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeOrmConfig } from "./config/typeorm.config"
import { AuthModule } from "./modules/auth/auth.module"
import { PostsModule } from "./modules/posts/posts.module"
import { CommentsModule } from "./modules/comments/comments.module"
import { StorageModule } from "./modules/storage/storage.module"
import { MailModule } from "./modules/mail/mail.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(typeOrmConfig),
        AuthModule,
        PostsModule,
        CommentsModule,
        StorageModule,
        MailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
