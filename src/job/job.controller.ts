import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JobService } from './job.service';
import { JobCreateDto, JobUpdateDto, JobsCreateDto } from 'src/libs/dto';
import { Auth } from 'src/libs/decorators/common.decorator';
import { User } from 'src/libs/decorators/user.decorator';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import RenewalInterceptor from 'src/libs/interceptors/renewal.interceptor';
import { CombileGuard } from 'src/libs/guards/combileAuth.guard';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Get('get-all')
  @HttpCode(200)
  @UseInterceptors(RenewalInterceptor)
  getAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('name') name: string,
    @Query('category') category: string,
    @Query('orderBy') orderBy: string,
    @Query('sort') sort: string,
    @Query('deliveryTime') deliveryTime: number,
    @Query('price') price: number,
  ) {
    return this.jobService.getAll(
      page && Number(page),
      pageSize && Number(pageSize),
      name,
      category && Number(category),
      orderBy,
      sort,
      deliveryTime && +deliveryTime,
      price && +price,
    );
  }

  @Get('get/:id')
  @HttpCode(200)
  @UseInterceptors(RenewalInterceptor)
  getDetail(
    @Param('id') id: string
  ) {
    return this.jobService.getDetail(Number(id));
  }

  @Post('add')
  @HttpCode(201)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  // @UseGuards(CombileGuard)
  @UseInterceptors(RenewalInterceptor)
  addOne(
    @Body() body: JobsCreateDto,
    @User() user,
  ) {
    console.log({ body })
    return this.jobService.addOne(user.userId, body);
  }

  @Patch('delete/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  delete(
    @Param('id') id: string,
    @User() user,
  ) {
    return this.jobService.deleteOne(user.userId, Number(id));
  }

  @Patch('update/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  update(
    @Body() data: JobUpdateDto,
    @Param('id') id: string,
    @User() user,
  ) {
    return this.jobService.update(user.userId, Number(id), data);
  }

  @Post('upload/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.SELLER]))
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @User() user,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('file in ser', file);
    return this.jobService.uploadImage(file, Number(id), user.userId);
  }
}
