"use client"

import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// Mapeamento de rotas para nomes amigáveis
const routeNames: Record<string, string> = {
    posts: "Posts",
    new: "Novo Post",
    edit: "Editar",
    login: "Login",
    register: "Criar Conta",
    profile: "Meu Perfil",
}

// Função global para gerenciar o título do breadcrumb
let breadcrumbTitle: string | undefined
let setBreadcrumbTitle: ((title: string | undefined) => void) | undefined

// Exporta a função para atualizar o título
export function updateBreadcrumbTitle(title: string | undefined) {
    setBreadcrumbTitle?.(title)
}

export function Breadcrumb() {
    const pathname = usePathname()
    const paths = pathname.split("/").filter(Boolean)
    const [title, setTitle] = useState(breadcrumbTitle)

    // Registra o callback para atualizar o título
    useEffect(() => {
        setBreadcrumbTitle = setTitle
    }, [])

    // Remove o ID do post do breadcrumb e substitui pelo título
    const filteredPaths = paths.map((path) => {
        if (paths[0] === "posts" && !isNaN(Number(path))) {
            return title || "..."
        }
        return path
    })

    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
                my: 2.5,
                "& .MuiBreadcrumbs-separator": {
                    mx: 1.5,
                    color: "text.secondary",
                },
                "& .MuiBreadcrumbs-li": {
                    display: "flex",
                    alignItems: "center",
                },
            }}
        >
            <MuiLink
                component={Link}
                href="/posts"
                underline="none"
                sx={{
                    color: "text.secondary",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s",
                    "&:hover": {
                        color: "primary.main",
                    },
                }}
            >
                Início
            </MuiLink>

            {filteredPaths.map((path, index) => {
                // Não mostrar breadcrumb para edit
                if (path === "edit") return null

                const routePath = "/" + paths.slice(0, index + 1).join("/")
                const isLast = index === filteredPaths.length - 1
                const name = routeNames[path] || path

                if (isLast) {
                    return (
                        <Typography
                            key={routePath}
                            sx={{
                                color: "text.primary",
                                fontSize: "0.95rem",
                                fontWeight: 500,
                            }}
                        >
                            {name}
                        </Typography>
                    )
                }

                return (
                    <MuiLink
                        key={routePath}
                        component={Link}
                        href={routePath}
                        underline="none"
                        sx={{
                            color: "text.secondary",
                            fontSize: "0.95rem",
                            transition: "all 0.2s",
                            "&:hover": {
                                color: "primary.main",
                            },
                        }}
                    >
                        {name}
                    </MuiLink>
                )
            })}
        </Breadcrumbs>
    )
}
