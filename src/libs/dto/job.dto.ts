import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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