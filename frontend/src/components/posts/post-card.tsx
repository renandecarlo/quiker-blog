"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Card, CardContent, Typography, Button, IconButton, Stack, Tooltip } from "@mui/material"
import { Post } from "@/types/post"
import { useAuth } from "@/contexts/auth.context"
import { PostContent } from "./post-content"
import { formatRelativeDate } from "@/utils/date"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import Link from "next/link"
import { postsService } from "@/services/posts.service"

interface PostCardProps {
    post: Post
    preview?: boolean
    onDelete?: () => void
}

export function PostCard({ post, preview, onDelete }: PostCardProps) {
    const router = useRouter()
    const { user, token } = useAuth()

    const [currentPost, setCurrentPost] = useState(post)
    const [isLoading, setIsLoading] = useState(false)

    const handleLike = async () => {
        if (!token || isLoading) return
        setIsLoading(true)
        try {
            const updatedPost = await postsService.likePost(post.id)
            setCurrentPost((prevPost) => ({
                ...prevPost,
                ...updatedPost,
            }))
        } catch (error) {
            console.error("Erro ao curtir post:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDislike = async () => {
        if (!token || isLoading) return
        setIsLoading(true)
        try {
            const updatedPost = await postsService.dislikePost(post.id)
            setCurrentPost((prevPost) => ({
                ...prevPost,
                ...updatedPost,
            }))
        } catch (error) {
            console.error("Erro ao descurtir post:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = () => {
        router.push(`/posts/edit/${post.id}`)
    }

    const handleDelete = async () => {
        if (!token) return

        try {
            if (window.confirm("Tem certeza que deseja excluir este post?")) {
                await postsService.deletePost(post.id)
                onDelete?.()
                router.push("/posts")
            }
        } catch (err) {
            console.error(`Falha ao excluir o post. ${err}`)
        }
    }

    const isAuthor = user?.id === post.user.id

    return (
        <Card sx={{ mb: 3, position: "relative" }}>
            {currentPost.coverImage && (
                <Box
                    component="img"
                    src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/posts/${currentPost.coverImage}`}
                    alt={currentPost.title}
                    sx={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                    }}
                />
            )}

            {isAuthor && (
                <Box sx={{ float: "right" }} padding={2}>
                    <Tooltip title="Editar post">
                        <IconButton onClick={handleEdit} size="small" sx={{ mr: 1 }}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir post">
                        <IconButton onClick={handleDelete} size="small" color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    {currentPost.title}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2" color="text.secondary">
                        por {currentPost.user.name} • {formatRelativeDate(currentPost.createdAt)}
                    </Typography>
                    <Tooltip title="Visualizações">
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <VisibilityIcon sx={{ fontSize: 14 }} color="action" />
                            <Typography variant="caption" color="text.secondary">
                                {currentPost.viewCount}
                            </Typography>
                        </Box>
                    </Tooltip>
                </Stack>

                <Box sx={{ mt: 2 }}>
                    {preview ? (
                        <PostContent content={currentPost.content} preview maxLength={300} />
                    ) : (
                        <PostContent content={currentPost.content} />
                    )}
                </Box>

                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title="Curtir">
                            <IconButton
                                size="small"
                                onClick={handleLike}
                                disabled={isLoading}
                                color={currentPost.userInteraction?.hasLiked ? "primary" : "default"}
                            >
                                <ThumbUpIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="body2" color="text.secondary">
                            {currentPost.likeCount}
                        </Typography>

                        <Tooltip title="Não curtir">
                            <IconButton
                                size="small"
                                onClick={handleDislike}
                                disabled={isLoading}
                                color={currentPost.userInteraction?.hasDisliked ? "error" : "default"}
                            >
                                <ThumbDownIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="body2" color="text.secondary">
                            {currentPost.dislikeCount}
                        </Typography>
                    </Stack>

                    {preview && (
                        <Button component={Link} variant="outlined" color="primary" href={`/posts/${post.id}`}>
                            Ler mais
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    )
}
