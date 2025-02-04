import { LoginData, RegisterData, AuthResponse, User, UpdateProfileData } from "@/types/auth"
import { api } from "@/lib/api"

// Função utilitária para configurar o token após autenticação
function setupAuth(token: string, user: User) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
}

// Função utilitária para tratar erros da API
function handleApiError(error: any): never {
    // Erros de validação
    if (error.response?.data?.errors?.length > 0) {
        const messages = error.response.data.errors.map((err: any) => err.messages.join(", ")).join("\n")
        throw new Error(messages)
    }

    // Erro genérico com mensagem da API
    if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
    }

    // Erro de rede ou outros erros
    throw new Error("Ocorreu um erro inesperado. Tente novamente.")
}

export async function login(data: LoginData): Promise<AuthResponse> {
    try {
        const response = await api.post<AuthResponse>("/auth/login", data)
        const { token, user } = response.data
        setupAuth(token, user)
        return response.data
    } catch (error: any) {
        handleApiError(error)
    }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
    try {
        const response = await api.post<AuthResponse>("/auth/register", data)
        const { token, user } = response.data
        setupAuth(token, user)
        return response.data
    } catch (error: any) {
        handleApiError(error)
    }
}

export async function getMe(): Promise<User> {
    try {
        const response = await api.get<User>("/auth/me")
        return response.data
    } catch (error: any) {
        handleApiError(error)
    }
}

export async function updateProfile(data: UpdateProfileData): Promise<User> {
    try {
        const response = await api.patch<User>("/auth/profile", data)
        const updatedUser = response.data
        localStorage.setItem("user", JSON.stringify(updatedUser))
        return updatedUser
    } catch (error: any) {
        handleApiError(error)
    }
}
