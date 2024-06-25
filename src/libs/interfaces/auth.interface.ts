export interface IAuthPayload {
    userId: number,
    role: string,
    iat: number,
    exp: number
}

export interface IAuthUser {
    userId: number,
    role: string,
}
