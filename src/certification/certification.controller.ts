import { Body, Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { Auth } from 'src/libs/decorators/common.decorator';
import { User } from 'src/libs/decorators/user.decorator';
import { CertiCreateDto } from 'src/libs/dto/certi.dto';

@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) { }

  @Get('get-all')
  @HttpCode(200)
  @Auth()
  getAll(
    @User() user,
  ) {
    return this.certificationService.getAllByUserId(user.userId);
  }

  @Post('add-one')
  @HttpCode(201)
  @Auth()
  addOne(
    @User() user,
    @Body() body: CertiCreateDto
  ) {
    return this.certificationService.addOne(user.userId, body);
  }

  @Patch('delete/:id')
  @HttpCode(200)
  @Auth()
  delete(
    @User() user,
    @Param('id') id: string
  ) {
    return this.certificationService.delete(user.userId, Number(id));
  }
}
