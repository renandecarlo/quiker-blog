import { Exclude, Expose, Type } from "class-transformer"
import { UserResponseDto } from "../../users/dto/user-response.dto"

// DTO para histórico de posts
@Exclude()
export class PostHistoryDto {
    @Expose()
    title: string

    @Expose()
    content: string

    @Expose()
    createdAt: Date
}

// DTO principal para resposta de posts
@Exclude()
export class PostResponseDto {
    @Expose()
    id: number

    @Expose()
    userId: number

    @Expose()
    title: string

    @Expose()
    content: string

    @Expose()
    coverImage?: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Expose()
    user: UserResponseDto

    @Expose()
    viewCount: number

    @Expose()
    likeCount: number

    @Expose()
    dislikeCount: number

    @Expose()
    userInteraction?: {
        hasViewed: boolean
        hasLiked: boolean
        hasDisliked: boolean
    }

    @Expose()
    @Type(() => PostHistoryDto)
    history: PostHistoryDto[]

    constructor(partial: Partial<PostResponseDto>) {
        Object.assign(this, partial)
    }
}
