import { Injectable } from "@nestjs/common"
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class StorageService {
    private s3Client: S3Client
    private bucket: string

    constructor(private configService: ConfigService) {
        const accountId = this.configService.getOrThrow<string>("R2_ACCOUNT_ID")
        this.bucket = this.configService.getOrThrow<string>("R2_BUCKET_NAME")

        this.s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: this.configService.getOrThrow<string>("R2_ACCESS_KEY_ID"),
                secretAccessKey: this.configService.getOrThrow<string>("R2_SECRET_ACCESS_KEY"),
            },
        })
    }

    async generatePresignedUrl(fileName: string, contentType: string, expiresIn = 3600): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: `posts/${fileName}`,
            ContentType: contentType,
        })

        return await getSignedUrl(this.s3Client, command, { expiresIn })
    }

    async deleteObject(fileName: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: `posts/${fileName}`,
        })

        await this.s3Client.send(command)
    }

    getPublicUrl(fileName: string): string {
        const subdomain = this.configService.getOrThrow<string>("R2_PUBLIC_DOMAIN")
        return `https://${subdomain}/${this.bucket}/posts/${fileName}`
    }
}
