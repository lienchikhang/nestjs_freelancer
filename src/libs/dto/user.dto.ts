import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class UserCreateDto {
    @IsNotEmpty()
    @IsString()
    fullName: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsStrongPassword()
    password: string
}