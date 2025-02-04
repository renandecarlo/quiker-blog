import { IsNotEmpty, IsString } from "class-validator"

export class CommentCreateDto {
    @IsString()
    @IsNotEmpty()
    content: string
}
