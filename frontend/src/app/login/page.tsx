"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Box, Container, Paper, Typography, TextField, Button, Stack, Alert, CircularProgress } from "@mui/material"
import { useAuth } from "@/contexts/auth.context"

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await login(email, password)
            router.push("/")
        } catch (err) {
            setError("Email ou senha inválidos")
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
                            Login
                        </Typography>

                        {error && <Alert severity="error">{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="Senha"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    fullWidth
                                />

                                <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
                                    {isLoading ? "Entrando..." : "Entrar"}
                                    {isLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
                                </Button>

                                <Typography align="center">
                                    Não tem uma conta?{" "}
                                    <Link href="/register" style={{ color: "inherit" }}>
                                        Registre-se
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
