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

  @Post('pay-with-vnpay')
  @HttpCode(201)
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @Auth()
  create(
    @Body() createHireDto: CreateHireDto,
    @User() user,
  ) {
    return this.hireService.create(user.userId, createHireDto);
  }

  @Post('pay-with-balance')
  @HttpCode(201)
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @Auth()
  payByAccountBalance(
    @Body() createHireDto: CreateHireDto,
    @User() user,
  ) {
    return this.hireService.payByAccountBalance(user.userId, createHireDto);
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

  @Get('get-all-by-seller')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  findAllBySeller(
    @User() user,
  ) {
    return this.hireService.findAllBySeller(user.userId);
  }

  @Get('get-detail-service-by-seller/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  findOne(
    @Param('id') id: string,
    @User() user,
  ) {
    return this.hireService.findServiceBySeller(user.userId, +id);
  }

  @Patch('finish-service-by-seller/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  finishServiceBySeller(
    @User() user,
    @Param('id') hireId: string,
  ) {
    return this.hireService.finishServiceBySeller(user.userId, +hireId)
  }

  @Patch('confirm-finish-service-by-user/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @Auth()
  confirmFinishServiceByUser(
    @User() user,
    @Param('id') hireId: string,
  ) {
    return this.hireService.confirmFinishByUser(user.userId, +hireId)
  }
}
