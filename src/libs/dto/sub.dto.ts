import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SubCreateDto {
    @IsNotEmpty()
    @IsString()
    subName: string

    @IsNotEmpty()
    @IsNumber()
    childTypeId: number

}