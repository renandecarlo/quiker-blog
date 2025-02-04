"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Container, Typography, Stack, Box } from "@mui/material"
import { Post } from "@/types/post"
import { PostCard } from "@/components/posts/post-card"
import { postsService } from "@/services/posts.service"
import { updateBreadcrumbTitle } from "@/components/layout/breadcrumb"
import { CommentsSection } from "@/components/comments/comments-section"

export default function PostPage() {
    const { id } = useParams()
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        updateBreadcrumbTitle("")

        async function loadPost() {
            try {
                const data = await postsService.getPost(Number(id))
                setPost(data)
                updateBreadcrumbTitle(data.title)
                setError(null)
            } catch (err: any) {
                setError(err.message || "Erro ao carregar post: " + err)
            } finally {
                setLoading(false)
            }
        }

        loadPost()
    }, [id])

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography>Carregando...</Typography>
            </Container>
        )
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        )
    }

    if (!post) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography>Post não encontrado</Typography>
            </Container>
        )
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={2}>
                <PostCard key={post.id} post={post} />

                <CommentsSection postId={post.id} postUserId={post.user.id} />
            </Stack>
        </Container>
    )
}
