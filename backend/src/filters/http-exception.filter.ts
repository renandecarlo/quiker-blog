import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common"
import { HttpAdapterHost } from "@nestjs/core"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost
        const ctx = host.switchToHttp()

        if (exception instanceof HttpException) {
            const status = exception.getStatus()
            const exceptionResponse = exception.getResponse()

            if (typeof exceptionResponse === "object") {
                httpAdapter.reply(ctx.getResponse(), exceptionResponse, status)
                return
            }

            httpAdapter.reply(
                ctx.getResponse(),
                {
                    statusCode: status,
                    message: exception.message,
                },
                status,
            )
            return
        }

        console.error("Erro não tratado:", exception)
        httpAdapter.reply(
            ctx.getResponse(),
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro interno do servidor",
                error: "Internal Server Error",
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        )
    }
}
