"use client"

import { useEffect, useState } from "react"
import { Container, Typography, Button, Box, CircularProgress, Alert } from "@mui/material"
import { PostCard } from "@/components/posts/post-card"
import { useAuth } from "@/contexts/auth.context"
import { Post } from "@/types/post"
import { postsService } from "@/services/posts.service"
import Link from "next/link"

export default function PostsPage() {
    const { user } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        loadPosts()
    }, [])

    const loadPosts = async () => {
        try {
            const data = await postsService.getPosts()
            setPosts(data)
        } catch (err) {
            setError(`Falha ao carregar os posts. ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Posts
                </Typography>

                {user && (
                    <Link href="/posts/new">
                        <Button variant="contained">Novo Post</Button>
                    </Link>
                )}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            {posts.length === 0 ? (
                <Typography pt={2}>Nenhum post encontrado.</Typography>
            ) : (
                posts.map((post) => <PostCard key={post.id} post={post} preview={true} onDelete={loadPosts} />)
            )}
        </Container>
    )
}
