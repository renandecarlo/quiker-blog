"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "@/types/auth"
import * as authService from "@/services/auth.service"

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken) {
            try {
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser)
                    setToken(storedToken)
                    setUser(parsedUser)
                    setIsLoading(false)
                } else {
                    authService
                        .getMe()
                        .then((userData) => {
                            setToken(storedToken)
                            setUser(userData)
                            localStorage.setItem("user", JSON.stringify(userData))
                        })
                        .catch(() => {
                            localStorage.removeItem("token")
                            localStorage.removeItem("user")
                            setToken(null)
                            setUser(null)
                        })
                        .finally(() => setIsLoading(false))
                }
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error)
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                setToken(null)
                setUser(null)
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
        }
    }, [])

    const login = async (email: string, password: string) => {
        const { token: newToken, user: userData } = await authService.login({
            email,
            password,
        })

        setToken(newToken)
        setUser(userData)
    }

    const register = async (name: string, email: string, password: string) => {
        const { token: newToken, user: userData } = await authService.register({
            name,
            email,
            password,
        })

        setToken(newToken)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
    }

    const updateUser = (updatedUser: User) => {
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
