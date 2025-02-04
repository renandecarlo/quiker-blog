import { Module } from "@nestjs/common"
import { MailerModule } from "@nestjs-modules/mailer"
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { MailService } from "./mail.service"
import { join } from "path"
import { ConfigService } from "@nestjs/config"

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const user = configService.get<string>("MAIL_USER")
                const pass = configService.get<string>("MAIL_PASS")

                if (!user || !pass) {
                    throw new Error("MAIL_USER e MAIL_PASS são obrigatórios para configurar o serviço de email")
                }

                return {
                    transport: {
                        host: configService.get<string>("MAIL_HOST", "sandbox.smtp.mailtrap.io"),
                        port: configService.get<number>("MAIL_PORT", 2525),
                        auth: {
                            user,
                            pass,
                        },
                        secure: false,
                    },
                    defaults: {
                        from: `"Quiker" <${configService.get<string>("MAIL_FROM", "noreply@quiker.com")}>`,
                    },
                    template: {
                        dir: join(__dirname, "templates"),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }
            },
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
