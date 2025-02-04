export interface LoginData {
    email: string
    password: string
}

export interface RegisterData extends LoginData {
    name: string
}

export interface UpdateProfileData {
    name?: string
    email?: string
    password?: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface User {
    id: number
    name: string
    email: string
}
