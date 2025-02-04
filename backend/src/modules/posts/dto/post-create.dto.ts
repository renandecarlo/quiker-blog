import { IsString, IsOptional } from "class-validator"

export class PostCreateDto {
    @IsString()
    title: string

    @IsString()
    content: string

    @IsOptional()
    @IsString()
    coverImage?: string
}
