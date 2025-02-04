import { Controller, Post, Body, Get, UseGuards, Patch } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto, RegisterDto, UpdateProfileDto } from "./dto/auth.dto"
import { JwtGuard } from "./guards/jwt.guard"
import { CurrentUser } from "./decorators/current-user.decorator"
import { User } from "../../entities/user.entity"

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto.name, registerDto.email, registerDto.password)
    }

    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password)
    }

    @Get("me")
    @UseGuards(JwtGuard)
    me(@CurrentUser() user: User) {
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    }

    @Patch("profile")
    @UseGuards(JwtGuard)
    async updateProfile(@CurrentUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
        const updatedUser = await this.authService.updateProfile(user.id, updateProfileDto)
        const { password: _, ...userWithoutPassword } = updatedUser
        return userWithoutPassword
    }
}
