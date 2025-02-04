import { Exclude, Expose } from "class-transformer"
import { UserResponseDto } from "../../users/dto/user-response.dto"

@Exclude()
export class CommentResponseDto {
    @Expose()
    id: number

    @Expose()
    content: string | null

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Expose()
    deletedAt: Date | null

    @Expose()
    user: UserResponseDto

    constructor(partial: Partial<CommentResponseDto>) {
        Object.assign(this, partial)
    }
}
