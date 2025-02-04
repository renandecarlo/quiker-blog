import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"
import { Post } from "../../entities/post.entity"
import { Comment } from "../../entities/comment.entity"

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    /**
     * Envia um e-mail para o autor do post quando um novo comentário é feito
     */
    async sendNewCommentNotification(post: Post, comment: Comment): Promise<void> {
        await this.mailerService.sendMail({
            to: post.user.email,
            subject: `Novo comentário em seu post: ${post.title}`,
            template: "new-comment",
            context: {
                userName: post.user.name,
                postTitle: post.title,
                commentUser: comment.user.name,
                commentContent: comment.content,
                postLink: `${process.env.FRONTEND_URL}/posts/${post.id}`,
            },
        })
    }
}
