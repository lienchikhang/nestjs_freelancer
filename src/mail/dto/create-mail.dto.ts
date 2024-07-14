import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateMailDto {
    @IsNotEmpty()
    @IsEmail()
    to: string;


}
