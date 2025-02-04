"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container, Typography, Box, TextField, Button, Alert, Paper } from "@mui/material"
import { useAuth } from "@/contexts/auth.context"
import * as authService from "@/services/auth.service"
import { UpdateProfileData } from "@/types/auth"

export default function ProfilePage() {
    const router = useRouter()
    const { user, updateUser, isLoading: authIsLoading } = useAuth()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!authIsLoading && !user) {
            router.push("/login")
            return
        }

        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name,
                email: user.email,
            }))
        }
    }, [user, router, authIsLoading])

    if (authIsLoading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography>Carregando...</Typography>
                </Paper>
            </Container>
        )
    }

    if (!user) {
        return null
    }

    const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }))
        setError("")
        setSuccess(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess(false)
        setIsSubmitting(true)

        try {
            const data: UpdateProfileData = {
                ...(formData.name && { name: formData.name.trim() }),
                ...(formData.email && { email: formData.email.trim() }),
                ...(formData.password && { password: formData.password }),
            }

            if (Object.keys(data).length === 0) {
                setError("Nenhuma alteração foi feita")
                setIsSubmitting(false)
                return
            }

            const updatedUser = await authService.updateProfile(data)
            updateUser({ ...user, ...updatedUser })
            setSuccess(true)
            setFormData((prev) => ({
                ...prev,
                password: "",
            }))
        } catch (err: any) {
            setError(err.message || "Falha ao atualizar perfil")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Meu Perfil
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Perfil atualizado com sucesso!
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        value={formData.name}
                        onChange={handleChange("name")}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="E-mail"
                        type="email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Nova senha (opcional)"
                        type="password"
                        value={formData.password}
                        onChange={handleChange("password")}
                        fullWidth
                        margin="normal"
                    />

                    <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 2 }}>
                        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}
