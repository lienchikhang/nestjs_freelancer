import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateServiceDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number

    @IsNotEmpty()
    serviceDesc: string

    @IsNotEmpty()
    serviceBenefit: string

    @IsNotEmpty()
    deliveryDate: number

    @IsNotEmpty()
    @IsString()
    serviceLevel: string
}

export class UpdateServiceDto {

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number

    @IsOptional()
    @IsNotEmpty()
    serviceDesc: string

    @IsOptional()
    @IsNotEmpty()
    serviceBenefit: string

    @IsOptional()
    @IsNotEmpty()
    deliveryDate: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    serviceLevel: string
}