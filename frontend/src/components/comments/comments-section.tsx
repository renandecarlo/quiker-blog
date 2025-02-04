"use client"

import { useEffect, useState, useCallback } from "react"
import { Box, Typography, Alert, CircularProgress, Card, CardContent } from "@mui/material"
import { Comment } from "@/types/comment"
import { CommentForm } from "./comment-form"
import { CommentItem } from "./comment-item"
import { useAuth } from "@/contexts/auth.context"
import { commentsService } from "@/services/comments.service"
import Link from "next/link"

interface CommentsSectionProps {
    postId: number
    postUserId: number
}

export function CommentsSection({ postId, postUserId }: CommentsSectionProps) {
    const { user } = useAuth()
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const loadComments = useCallback(async () => {
        try {
            const data = await commentsService.getComments(postId)
            setComments(data)
        } catch (err) {
            setError("Falha ao carregar comentários: " + err)
        } finally {
            setIsLoading(false)
        }
    }, [postId])

    useEffect(() => {
        loadComments()
    }, [postId, loadComments])

    const handleCreate = async (data: { content: string }) => {
        if (!user) return

        setIsSubmitting(true)
        try {
            const newComment = await commentsService.createComment(postId, data)
            setComments((prev) => [newComment, ...prev])
        } catch (err) {
            setError("Falha ao criar comentário: " + err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdate = async (commentId: number, content: string) => {
        if (!user) return

        try {
            const updatedComment = await commentsService.updateComment(postId, commentId, { content })
            setComments((prev) => prev.map((comment) => (comment.id === commentId ? updatedComment : comment)))
        } catch (err) {
            setError("Falha ao atualizar comentário: " + err)
        }
    }

    const handleDelete = async (commentId: number) => {
        if (!user) return

        try {
            await commentsService.deleteComment(postId, commentId)

            // Seta o deletedAt para a data atual
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId ? { ...comment, deletedAt: new Date().toISOString() } : comment,
                ),
            )
        } catch (err) {
            setError("Falha ao excluir comentário: " + err)
        }
    }

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 200,
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box mt={6}>
            <Typography variant="h6" pt={4} pb={1}>
                Deixe um comentário
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {user ? (
                <CommentForm onSubmit={handleCreate} isLoading={isSubmitting} />
            ) : (
                <Card variant="outlined">
                    <CardContent sx={{ p: 3 }}>
                        <Typography color="text.secondary">
                            Faça <Link href="/login">login</Link> ou <Link href="/register">cadastre-se</Link> para
                            poder comentar.
                        </Typography>
                    </CardContent>
                </Card>
            )}

            <Typography variant="h6" pt={4}>
                Comentários ({comments.length})
            </Typography>

            {comments.length === 0 ? (
                <Typography pt={1}>Ainda não há comentários. Seja o primeiro a comentar!</Typography>
            ) : (
                <Box sx={{ mt: 2 }}>
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postUserId={postUserId}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </Box>
            )}
        </Box>
    )
}
