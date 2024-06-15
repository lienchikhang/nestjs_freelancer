import { IsNotEmpty, IsString } from "class-validator";

export class TypeCreateDto {
    @IsNotEmpty()
    @IsString()
    typeName: string
}