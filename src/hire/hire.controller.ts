import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Query } from '@nestjs/common';
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
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.hireService.findAll(user.userId, page && +page, pageSize && +pageSize);
  }

  @Get('count-all')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @Auth()
  countAll(
    @User() user,
  ) {
    return this.hireService.countAllDone(user.userId);
  }

  @Get('count-all-seller')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @Auth()
  countAllSeller(
    @User() user,
    @Query('serviceId') serviceId: string,
  ) {
    return this.hireService.countAllServicesProgress(user.userId, +serviceId);
  }

  @Get('get-all-by-seller')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  findAllBySeller(
    @User() user,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    console.log({ page, pageSize });
    return this.hireService.findAllBySeller(user.userId, page && Number(page), pageSize && Number(pageSize));
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
