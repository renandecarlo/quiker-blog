"use client"

import { AppBar, Toolbar, Button, Box, Typography, Link } from "@mui/material"
import { useAuth } from "@/contexts/auth.context"

export function Header() {
    const { user, logout } = useAuth()

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{
                backgroundColor: "rgba(210, 180, 140, 0.15)",
                borderBottom: "1px solid",
                borderColor: "rgba(210, 180, 140, 0.3)",
                borderRadius: "0 0 6px 6px",
            }}
        >
            <Toolbar sx={{ py: 1 }}>
                <Typography
                    variant="h5"
                    component={Link}
                    href="/posts"
                    sx={{
                        textDecoration: "none",
                        color: "text.primary",
                        fontWeight: 600,
                        letterSpacing: "-0.5px",
                        "&:hover": {
                            color: "primary.dark",
                        },
                    }}
                >
                    Quiker
                </Typography>

                <Box sx={{ ml: 4 }}>
                    <Button
                        component={Link}
                        href="/posts"
                        sx={{
                            color: "text.primary",
                            fontWeight: 500,
                            "&:hover": {
                                backgroundColor: "rgba(210, 180, 140, 0.2)",
                                color: "primary.dark",
                            },
                        }}
                    >
                        Posts
                    </Button>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    {user ? (
                        <>
                            <Box
                                component={Link}
                                href="/profile"
                                title="Meu perfil"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    py: 0.5,
                                    px: 2,
                                    borderRadius: 1.5,
                                    backgroundColor: "rgba(210, 180, 140, 0.1)",
                                    textDecoration: "none",
                                    "&:hover": {
                                        backgroundColor: "rgba(210, 180, 140, 0.2)",
                                    },
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "text.primary",
                                        fontWeight: 500,
                                    }}
                                >
                                    Olá, {user.name}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={logout}
                                sx={{
                                    boxShadow: "none",
                                    "&:hover": {
                                        boxShadow: "none",
                                        backgroundColor: "secondary.dark",
                                    },
                                }}
                            >
                                Sair
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                href="/login"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: 500,
                                    "&:hover": {
                                        backgroundColor: "rgba(210, 180, 140, 0.2)",
                                        color: "primary.dark",
                                    },
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                href="/register"
                                variant="contained"
                                color="primary"
                                sx={{
                                    boxShadow: "none",
                                    "&:hover": {
                                        boxShadow: "none",
                                        backgroundColor: "primary.dark",
                                    },
                                }}
                            >
                                Criar Conta
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
