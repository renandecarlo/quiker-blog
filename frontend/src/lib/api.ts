import axios from "axios"

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
})

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    // Verifica se estamos no browser
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Erro de rede ou servidor não disponível
        if (!error.response) {
            throw new Error("Erro de conexão. Verifique sua internet.")
        }

        // Erro de autenticação
        if (error.response.status === 401) {
            // Se estamos no browser, limpa o token
            if (typeof window !== "undefined") {
                localStorage.removeItem("token")
                // Redirecionar para a página de login
                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/login"
                }
            }
            throw new Error("Sessão expirada. Por favor, faça login novamente.")
        }

        // Erro de permissão
        if (error.response.status === 403) {
            const message = error.response.data?.message || "Você não tem permissão para realizar esta ação"
            throw new Error(message)
        }

        // Erro do servidor
        if (error.response.status >= 500) {
            throw new Error("Erro no servidor. Tente novamente mais tarde.")
        }

        // Outros erros (incluindo erros de validação 400)
        throw error
    },
)
