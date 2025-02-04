"use client"

import { useState } from "react"
import { Box, TextField, Button, CircularProgress } from "@mui/material"
import { CreatePostData, UpdatePostData, PostHistory as PostHistoryType } from "@/types/post"
import { AdvancedEditor } from "../editor/advanced-editor"
import { ImageUploader } from "./image-uploader"
import { PostHistory } from "./post-history"

type PostData = (CreatePostData | UpdatePostData) & {
    history?: PostHistoryType[]
}

interface PostFormProps<T extends PostData> {
    onSubmit: (data: T) => Promise<void>
    initialData?: Partial<T>
    submitLabel?: string
    isLoading?: boolean
}

export function PostForm<T extends PostData>({
    onSubmit,
    initialData = {},
    submitLabel = "Publicar",
    isLoading = false,
}: PostFormProps<T>) {
    const [title, setTitle] = useState(initialData.title || "")
    const [content, setContent] = useState(initialData.content || "")
    const [coverImage, setCoverImage] = useState<string | undefined>(initialData.coverImage)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) {
            console.error("Título e conteúdo são obrigatórios")
            return
        }

        const formData = {
            title,
            content,
            coverImage,
        } as T

        try {
            await onSubmit(formData)
        } catch (err) {
            console.error("Erro ao enviar formulário:", err)
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 4 }}
            />

            <Box mb={4}>
                <ImageUploader initialImage={coverImage} onImageChange={setCoverImage} disabled={isLoading} />
            </Box>

            <Box mb={4}>
                <AdvancedEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Escreva seu post..."
                    disabled={isLoading}
                />
            </Box>

            <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>
                {submitLabel}
                {isLoading && <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />}
            </Button>

            <Box
                sx={{
                    mt: 4,
                    position: "relative",
                    minHeight: initialData.history?.length ? 200 : "auto",
                    "&::after": {
                        content: '""',
                        display: "table",
                        clear: "both",
                    },
                }}
            >
                {initialData.history && (
                    <Box textAlign="center">
                        <PostHistory history={initialData.history} />
                    </Box>
                )}
            </Box>
        </Box>
    )
}
