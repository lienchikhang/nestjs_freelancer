import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateServiceDto } from "./service.dto";

export class JobCreateDto {
    @IsNotEmpty()
    @IsString()
    jobName: string

    @IsNotEmpty()
    @IsString()
    jobDesc: string

    @IsNotEmpty()
    @IsNumber()
    subId: number
}

export class JobsCreateDto {
    @IsNotEmpty()
    data: JobCreateDto

    @IsNotEmpty()
    services: CreateServiceDto[]
}

export class JobUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    jobName: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    jobDesc: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    subId: number
}