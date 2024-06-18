import { IsNotEmpty, IsNumber, IsPositive, Max } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Max(5)
    rateNum: number
}