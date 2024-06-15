import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillCreateDto } from 'src/libs/dto/skill.dto';
import AuthGuard from 'src/libs/guards/auth.guard';
import { User } from 'src/libs/decorators/user.decorator';
import RenewalInterceptor from 'src/libs/interceptors/renewal.interceptor';
import { Auth } from 'src/libs/decorators/common.decorator';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {
  }

  @Get('get-all')
  @HttpCode(200)
  @Auth()
  getAll(
    @User() user,
  ) {
    return this.skillService.getAllByUserId(user.userId);
  }

  @Post('add-one')
  @HttpCode(201)
  @Auth()
  addOne(
    @User() user,
    @Body() body: SkillCreateDto
  ) {
    return this.skillService.addOne(user.userId, body);
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @Auth()
  delete(
    @User() user,
    @Param('id') id: string
  ) {
    return this.skillService.delete(user.userId, Number(id));
  }
}
