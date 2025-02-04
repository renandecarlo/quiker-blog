"use client"

import { useRef, useState } from "react"
import { Box, Button, IconButton, Typography, CircularProgress } from "@mui/material"
import Image from "next/image"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import DeleteIcon from "@mui/icons-material/Delete"
import { postsService } from "@/services/posts.service"

interface ImageUploaderProps {
    initialImage?: string
    onImageChange: (fileName: string | undefined) => void
    disabled?: boolean
}

export function ImageUploader({ initialImage, onImageChange, disabled = false }: ImageUploaderProps) {
    const [coverImage, setCoverImage] = useState<string | undefined>(initialImage)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const fileName = await postsService.uploadImage(file)
            setCoverImage(fileName)
            onImageChange(fileName)
        } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = () => {
        setCoverImage(undefined)
        onImageChange(undefined)
    }

    return (
        <Box sx={{ position: "relative" }}>
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageUpload}
                disabled={disabled || isUploading}
            />

            {coverImage ? (
                <Box sx={{ position: "relative", mb: 2 }}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: 300,
                            borderRadius: 1,
                            overflow: "hidden",
                        }}
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/posts/${coverImage}`}
                            alt="Capa do post"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </Box>
                    <IconButton
                        onClick={handleRemoveImage}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "background.paper",
                            "&:hover": { bgcolor: "background.paper" },
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ) : (
                <Button
                    variant="outlined"
                    onClick={handleImageClick}
                    disabled={disabled || isUploading}
                    sx={{ mb: 2, width: "100%", height: 100 }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <AddPhotoAlternateIcon sx={{ mb: 1 }} />
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2">
                                {isUploading ? "Fazendo upload..." : "Adicionar imagem de capa"}
                            </Typography>
                            {isUploading && <CircularProgress size={16} sx={{ ml: 1 }} />}
                        </Box>
                    </Box>
                </Button>
            )}
        </Box>
    )
}
