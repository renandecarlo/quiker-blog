import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../../entities/user.entity"
import * as bcrypt from "bcryptjs"
import { JwtPayload } from "./interfaces/jwt-payload.interface"
import { UpdateProfileDto } from "./dto/auth.dto"

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(name: string, email: string, password: string) {
        // Verificar se o usuário já existe
        const existingUser = await this.userRepository.findOne({ where: { email } })
        if (existingUser) {
            throw new UnauthorizedException("Email já cadastrado")
        }

        // Criar novo usuário
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
        })

        await this.userRepository.save(user)

        // Gerar token
        const payload: JwtPayload = { userId: user.id }
        const token = this.jwtService.sign(payload)

        // Remover a senha antes de retornar
        const { password: _, ...userWithoutPassword } = user

        return {
            token,
            user: userWithoutPassword,
        }
    }

    async login(email: string, password: string) {
        // Buscar usuário
        const user = await this.userRepository.findOne({ where: { email } })
        if (!user) {
            throw new UnauthorizedException("Credenciais inválidas")
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException("Credenciais inválidas")
        }

        // Gerar token
        const payload: JwtPayload = { userId: user.id }
        const token = this.jwtService.sign(payload)

        // Remover a senha antes de retornar
        const { password: _, ...userWithoutPassword } = user

        return {
            token,
            user: userWithoutPassword,
        }
    }

    async validateToken(token: string): Promise<User> {
        try {
            const payload = this.jwtService.verify<JwtPayload>(token)
            const user = await this.userRepository.findOne({ where: { id: payload.userId } })
            if (!user) {
                throw new UnauthorizedException()
            }
            return user
        } catch {
            throw new UnauthorizedException()
        }
    }

    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new UnauthorizedException("Usuário não encontrado")
        }

        // Se houver uma nova senha, fazer o hash
        if (updateProfileDto.password) {
            updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, 10)
        }

        // Atualizar os campos fornecidos
        Object.assign(user, updateProfileDto)

        // Salvar as alterações
        await this.userRepository.save(user)

        return user
    }
}
