import { Body, Controller, Get, HttpCode, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeCreateDto } from 'src/libs/dto/type.dto';
import { Auth } from 'src/libs/decorators/common.decorator';
import { User } from 'src/libs/decorators/user.decorator';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) { }

  @Get('get-all')
  @HttpCode(200)
  getAll() {
    return this.typeService.getAllInOne();
  }

  @Get('get-only')
  @HttpCode(200)
  getOnlyType() {
    return this.typeService.getOnlyType();
  }

  @Post('add')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.ADMIN]))
  @Auth()
  add(
    @Body() data: TypeCreateDto,
    @User() user,
  ) {
    return this.typeService.addOne(user.userId, data);
  }

  @Patch('delete/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.ADMIN]))
  @Auth()
  delete(
    @Param('id') id: string,
    @User() user,
  ) {
    return this.typeService.deleteOne(user.userId, Number(id));
  }

  @Post('upload/:id')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.typeService.uploadImage(Number(id), file);
  }

}
