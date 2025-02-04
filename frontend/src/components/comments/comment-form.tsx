"use client"

import { useState } from "react"
import { Box, Button, Typography, CircularProgress } from "@mui/material"
import { CreateCommentData } from "@/types/comment"
import { BasicEditor } from "../editor/basic-editor"

interface CommentFormProps {
    onSubmit: (data: CreateCommentData) => Promise<void>
    initialContent?: string
    submitLabel?: string
    isLoading?: boolean
}

export function CommentForm({
    onSubmit,
    initialContent = "",
    submitLabel = "Comentar",
    isLoading = false,
}: CommentFormProps) {
    const [content, setContent] = useState(initialContent)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const trimmedContent = content.trim()
        if (!trimmedContent) {
            setError("O comentário não pode estar vazio")
            return
        }

        try {
            await onSubmit({ content: trimmedContent })
            if (!initialContent) {
                setContent("")
            }
            setError(null)
        } catch (error: any) {
            console.error("Erro ao enviar comentário:", error)
            setError(error.message || "Erro ao enviar comentário")
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box mb={2}>
                <BasicEditor
                    value={content}
                    onChange={(value) => {
                        setContent(value)
                        setError(null)
                    }}
                    placeholder="Escreva seu comentário..."
                />
                {error && (
                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}
            </Box>
            <Button type="submit" variant="contained" disabled={!content.trim() || isLoading} sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {isLoading ? "Enviando..." : submitLabel}
                    {isLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
                </Box>
            </Button>
        </Box>
    )
}
