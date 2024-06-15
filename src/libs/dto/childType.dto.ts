import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChildTypeCreateDto {
    @IsNotEmpty()
    @IsString()
    childTypeName: string

    @IsNotEmpty()
    @IsNumber()
    typeId: number
}