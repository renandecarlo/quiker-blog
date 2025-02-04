import { IsString, IsOptional } from "class-validator"

export class PostUpdateDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    content?: string

    @IsString()
    @IsOptional()
    coverImage?: string
}
