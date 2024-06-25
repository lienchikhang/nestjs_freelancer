import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateVnpayDto {
    @IsNotEmpty()
    @IsString()
    bankCode: string

    @IsNotEmpty()
    @IsNumber()
    service: number

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNotEmpty()
    @IsString()
    method: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    jobId: number

    @IsNotEmpty()
    @IsEmail()
    email: string
}