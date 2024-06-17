import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { HireService } from './hire.service';
import { CreateHireDto } from 'src/libs/dto';
import { Auth } from 'src/libs/decorators/common.decorator';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';
import { User } from 'src/libs/decorators/user.decorator';

@Controller('hire')
export class HireController {
  constructor(private readonly hireService: HireService) { }

  @Post('create')
  @HttpCode(201)
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @Auth()
  create(
    @Body() createHireDto: CreateHireDto,
    @User() user,
  ) {
    return this.hireService.create(user.userId, createHireDto);
  }

  @Get('get-all')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @Auth()
  findAll(
    @User() user,
  ) {
    return this.hireService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hireService.findOne(+id);
  }

}
