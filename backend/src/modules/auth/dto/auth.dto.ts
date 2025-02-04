import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator"

export class RegisterDto {
    @IsString({ message: "O nome deve ser uma string" })
    @IsNotEmpty({ message: "O nome é obrigatório" })
    name: string

    @IsEmail({}, { message: "Email inválido" })
    @IsNotEmpty({ message: "O email é obrigatório" })
    email: string

    @IsString({ message: "A senha deve ser uma string" })
    @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    password: string
}

export class LoginDto {
    @IsEmail({}, { message: "Email inválido" })
    @IsNotEmpty({ message: "O email é obrigatório" })
    email: string

    @IsString({ message: "A senha deve ser uma string" })
    @IsNotEmpty({ message: "A senha é obrigatória" })
    password: string
}

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    @MinLength(3)
    name?: string

    @IsEmail()
    @IsOptional()
    email?: string

    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string
}
