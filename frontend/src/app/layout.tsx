import type { Metadata } from "next"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/contexts/auth.context"
import { Container } from "@mui/material"
import { Header } from "@/components/layout/header"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import "./globals.css"

export const metadata: Metadata = {
    title: "Quiker",
    description: "Uma plataforma de blog minimalista",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                <ThemeProvider>
                    <AuthProvider>
                        <Header />
                        <Container>
                            <Breadcrumb />
                            {children}
                        </Container>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
