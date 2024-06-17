import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateHireDto {
    @IsNotEmpty()
    @IsNumber()
    serviceId: number

    @IsNotEmpty()
    @IsString()
    method: string
}