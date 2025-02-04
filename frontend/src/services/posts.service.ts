import { Post } from "@/types/post"
import { api } from "@/lib/api"

export const postsService = {
    async getPosts(): Promise<Post[]> {
        const response = await api.get("/posts")
        return response.data
    },

    async getPost(id: number): Promise<Post> {
        const response = await api.get(`/posts/${id}`)
        return response.data
    },

    async createPost(data: Partial<Post>): Promise<Post> {
        const response = await api.post("/posts", data)
        return response.data
    },

    async updatePost(id: number, data: Partial<Post>): Promise<Post> {
        const response = await api.patch(`/posts/${id}`, data)
        return response.data
    },

    async deletePost(id: number): Promise<void> {
        await api.delete(`/posts/${id}`)
    },

    async getPostsByUser(userId: number): Promise<Post[]> {
        const response = await api.get(`/posts/user/${userId}`)
        return response.data
    },

    async likePost(id: number): Promise<Post> {
        const response = await api.post(`/posts/${id}/like`)
        return response.data
    },

    async dislikePost(id: number): Promise<Post> {
        const response = await api.post(`/posts/${id}/dislike`)
        return response.data
    },

    async uploadImage(file: File): Promise<string> {
        // Primeiro, obter a URL assinada para upload
        const fileName = `${Date.now()}-${file.name}`
        const { data } = await api.post("/posts/upload-url", {
            fileName,
            contentType: file.type,
        })

        // Fazer upload do arquivo usando a URL assinada
        await fetch(data.url, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        })

        return fileName
    },
}
