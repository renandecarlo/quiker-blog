import { User } from "./auth"
import { Comment } from "./comment"

export interface Post {
    id: number
    title: string
    content: string
    coverImage?: string
    createdAt: string
    updatedAt: string
    userId: number
    user: User
    comments: Comment[]
    viewCount: number
    likeCount: number
    dislikeCount: number
    history?: PostHistory[]
    userInteraction?: {
        hasViewed: boolean
        hasLiked: boolean
        hasDisliked: boolean
    }
}

export interface PostHistory {
    id: number
    postId: number
    title: string
    content: string
    imageUrl?: string
    createdAt: string
}

export interface CreatePostData {
    title: string
    content: string
    coverImage?: string
}

export interface UpdatePostData {
    title?: string
    content?: string
    coverImage?: string
}
