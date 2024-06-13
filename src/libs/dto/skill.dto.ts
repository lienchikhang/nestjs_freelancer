import { IsNotEmpty, IsString } from "class-validator";

export class SkillCreateDto {

    @IsNotEmpty()
    @IsString()
    skillName: string

}