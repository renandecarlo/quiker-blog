"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container, Typography, Box } from "@mui/material"
import { PostForm } from "@/components/posts/post-form"
import { useAuth } from "@/contexts/auth.context"
import { CreatePostData } from "@/types/post"
import { postsService } from "@/services/posts.service"

export default function NewPostPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: CreatePostData): Promise<void> => {
        if (!user) {
            router.push("/login")
            return
        }

        setIsLoading(true)
        try {
            const post = await postsService.createPost(data)
            router.push(`/posts/${post.id}`)
        } catch (err) {
            console.error("Erro ao criar post:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1">
                    Novo Post
                </Typography>
            </Box>

            <PostForm<CreatePostData> onSubmit={handleSubmit} isLoading={isLoading} />
        </Container>
    )
}
