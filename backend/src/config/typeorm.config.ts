import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { User } from "../entities/user.entity"
import { Post } from "../entities/post.entity"
import { Comment } from "../entities/comment.entity"
import { PostHistory } from "../entities/post-history.entity"
import { PostInteraction } from "../entities/post-interaction.entity"
import { DataSource } from "typeorm"

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: "postgres",
        host: configService.getOrThrow<string>("DB_HOST"),
        port: configService.getOrThrow<number>("DB_PORT"),
        username: configService.getOrThrow<string>("DB_USERNAME"),
        password: configService.getOrThrow<string>("DB_PASSWORD"),
        database: configService.getOrThrow<string>("DB_DATABASE"),
        entities: [User, Post, Comment, PostHistory, PostInteraction],
        synchronize: true,
        logging: process.env.NODE_ENV !== "production",
        migrations: ["dist/migrations/*.js d"],
        migrationsTableName: "migrations",
    }),
}

export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "quiker",
    entities: [User, Post, Comment, PostHistory, PostInteraction],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
})
