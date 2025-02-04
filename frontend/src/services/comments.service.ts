import { Comment } from "@/types/comment"
import { api } from "@/lib/api"

export const commentsService = {
    async getComments(postId: number): Promise<Comment[]> {
        const response = await api.get(`/posts/${postId}/comments`)
        return response.data
    },

    async createComment(postId: number, data: { content: string }): Promise<Comment> {
        const response = await api.post(`/posts/${postId}/comments`, data)
        return response.data
    },

    async updateComment(postId: number, commentId: number, data: { content: string }): Promise<Comment> {
        const response = await api.put(`/posts/${postId}/comments/${commentId}`, data)
        return response.data
    },

    async deleteComment(postId: number, commentId: number): Promise<void> {
        await api.delete(`/posts/${postId}/comments/${commentId}`)
    },
}
