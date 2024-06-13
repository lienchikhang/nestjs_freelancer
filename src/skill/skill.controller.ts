import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillCreateDto } from 'src/libs/dto/skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {
  }

  @Get('get-all')
  @HttpCode(200)
  getAll() {
    return this.skillService.getAllByUserId(1);
  }

  @Post('add-one')
  @HttpCode(201)
  addOne(
    @Body() body: SkillCreateDto
  ) {
    return this.skillService.addOne(1, body);
  }
}
