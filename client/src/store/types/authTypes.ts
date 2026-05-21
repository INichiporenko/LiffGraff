export type authStateType = {
    status: string,
    error: string | null,
}

export type LoginDataType = {
    usernameOrEmail: string,
    password: string,
}
export type RegisterDataType = {
    username: string,
    email: string,
    fullName: string,
    password: string,
}

export type ResetDataType = {
    usernameOrEmail: string,
}

export type LogoutDataType = Record<string, never>; // Explicitly define an empty object type
