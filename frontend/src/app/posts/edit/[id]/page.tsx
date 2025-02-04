"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Box, Container, Typography, CircularProgress, Alert } from "@mui/material"
import { PostForm } from "@/components/posts/post-form"
import { useAuth } from "@/contexts/auth.context"
import { Post, UpdatePostData } from "@/types/post"
import { postsService } from "@/services/posts.service"
import { updateBreadcrumbTitle } from "@/components/layout/breadcrumb"

export default function EditPostPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")

    const loadPost = useCallback(async () => {
        try {
            const data = await postsService.getPost(Number(params.id))
            setPost(data)
            updateBreadcrumbTitle(data.title)
        } catch (error: any) {
            console.error("Erro ao carregar post:", error)
            setError(error.message || "Erro ao carregar post")
            router.push("/posts")
        } finally {
            setIsLoading(false)
        }
    }, [params.id, router])

    useEffect(() => {
        updateBreadcrumbTitle("")
        loadPost()
    }, [params.id, loadPost])

    const handleSubmit = async (data: UpdatePostData) => {
        if (!user || !post) return

        setIsSaving(true)
        try {
            await postsService.updatePost(post.id, data)
            router.push(`/posts/${post.id}`)
        } catch (err) {
            setError(`Falha ao atualizar o post. ${err}`)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

    if (!post) {
        return (
            <Container maxWidth="md">
                <Alert severity="error">{error}</Alert>
            </Container>
        )
    }

    return (
        <Container maxWidth="md">
            <Box mb={4}>
                <Typography variant="h4" component="h1">
                    Editar Post
                </Typography>
            </Box>

            <PostForm<UpdatePostData> initialData={post} onSubmit={handleSubmit} isLoading={isSaving} />
        </Container>
    )
}
