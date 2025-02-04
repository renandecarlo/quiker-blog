import { User } from "./auth"

export interface Comment {
    id: number
    content: string
    user: User
    postId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

export interface CreateCommentData {
    content: string
}
