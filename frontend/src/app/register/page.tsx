"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Box, Container, Paper, Typography, TextField, Button, Stack, Alert } from "@mui/material"
import { useAuth } from "@/contexts/auth.context"

export default function RegisterPage() {
    const router = useRouter()
    const { register } = useAuth()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await register(name, email, password)
            router.push("/")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Erro ao criar conta. Tente novamente.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Typography variant="h4" component="h1" align="center">
                            Criar Conta
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ whiteSpace: "pre-line" }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Nome"
                                    variant="outlined"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />

                                <TextField
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />

                                <TextField
                                    label="Senha"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />

                                <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
                                    {isLoading ? "Criando conta..." : "Criar Conta"}
                                </Button>

                                <Typography align="center">
                                    Já tem uma conta?{" "}
                                    <Link href="/login" style={{ color: "inherit" }}>
                                        Faça login
                                    </Link>
                                </Typography>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    )
}
