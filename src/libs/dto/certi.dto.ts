import { IsNotEmpty, IsString } from "class-validator";

export class CertiCreateDto {
    @IsNotEmpty()
    @IsString()
    certiName: string
}

export class CertiUpdateDto {

}