import { IsString } from "class-validator"

export class CommentUpdateDto {
    @IsString()
    content: string
}
