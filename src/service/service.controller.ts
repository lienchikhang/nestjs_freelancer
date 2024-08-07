import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { Auth } from 'src/libs/decorators/common.decorator';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';
import { CreateServiceDto, UpdateServiceDto } from 'src/libs/dto';
import { User } from 'src/libs/decorators/user.decorator';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post('add/:jobId')
  @HttpCode(201)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  create(
    @User() user,
    @Body() createServiceDto: CreateServiceDto,
    @Param('jobId') jobId: string,
  ) {
    return this.serviceService.create(user.userId, Number(jobId), createServiceDto);
  }

  @Get('get-by-job-id/:id')
  findAll(
    @Param('id') jobId: string,
  ) {
    return this.serviceService.findAll(Number(jobId));
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
    return this.serviceService.findAllBySeller(user.userId, page && +page, pageSize && +pageSize);
  }


  @Patch('update/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @User() user,
  ) {
    return this.serviceService.update(+id, user.userId, updateServiceDto);
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  remove(
    @Param('id') id: string,
    @User() user,
  ) {
    return this.serviceService.remove(+id, user.userId);
  }
}
