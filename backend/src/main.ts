import { NestFactory, HttpAdapterHost } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe, BadRequestException } from "@nestjs/common"
import { ValidationError } from "class-validator"
import { HttpExceptionFilter } from "./filters/http-exception.filter"

// Constantes de configuração
const PORT = process.env.PORT || 3001

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // Configuração do CORS
    app.enableCors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })

    // Configuração global de validação de dados
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            // Personaliza o formato das mensagens de erro
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                const errors = validationErrors.map((error) => ({
                    field: error.property,
                    messages: Object.values(error.constraints || {}),
                }))

                // Lança uma BadRequestException com nossa estrutura customizada
                throw new BadRequestException({
                    statusCode: 400,
                    error: "Erro de Validação",
                    errors,
                })
            },
        }),
    )

    // Configuração global do filtro de exceções HTTP
    app.useGlobalFilters(new HttpExceptionFilter(app.get(HttpAdapterHost)))

    await app.listen(PORT)
    console.log(`Servidor rodando na porta ${PORT}`)
}

bootstrap().catch((error) => {
    console.error("Erro ao iniciar o servidor:", error)
    process.exit(1)
})
