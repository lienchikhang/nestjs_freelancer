import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { JobCreateDto } from 'src/libs/dto';
import { Auth } from 'src/libs/decorators/common.decorator';
import { User } from 'src/libs/decorators/user.decorator';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Get('get-all')
  @HttpCode(200)
  getAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('name') name: string,
    @Query('category') category: string,
    @Query('orderBy') orderBy: string,
    @Query('sort') sort: string,
  ) {
    return this.jobService.getAll(
      page && Number(page),
      pageSize && Number(pageSize),
      name,
      category && Number(category),
      orderBy,
      sort,
    );
  }

  @Post('add')
  @HttpCode(201)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  addOne(
    @Body() data: JobCreateDto,
    @User() user,
  ) {
    return this.jobService.addOne(user.userId, data);
  }
}
