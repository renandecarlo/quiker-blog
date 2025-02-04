import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { AuthService } from "../auth.service"

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new UnauthorizedException()
        }

        const [type, token] = authHeader.split(" ")
        if (type !== "Bearer") {
            throw new UnauthorizedException()
        }

        try {
            const user = await this.authService.validateToken(token)
            request.user = user
            return true
        } catch {
            throw new UnauthorizedException()
        }
    }
}
