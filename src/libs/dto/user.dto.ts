import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator"

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

export class UserUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    full_name: string

    @IsOptional()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string

}

export class UserLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class ICheckValid {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    value: string
}