import { Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SubService } from './sub.service';
import { Auth } from 'src/libs/decorators/common.decorator';
import { User } from 'src/libs/decorators/user.decorator';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';
import { SubCreateDto } from 'src/libs/dto';

@Controller('sub')
export class SubController {
  constructor(private readonly subService: SubService) { }

  @Get('get-all/:typeId')
  @HttpCode(200)
  getAll(
    @Param('typeId') typeId: string,
  ) {
    return this.subService.getAllByChildTypeId(Number(typeId));
  }

  @Post('add')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.ADMIN, ROLE.USER]))
  @Auth()
  add(
    @Body() data: SubCreateDto,
    @User() user,
  ) {
    return this.subService.addOne(user.userId, data);
  }

  @Patch('delete/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.ADMIN]))
  @Auth()
  delete(
    @Param('id') id: string,
    @User() user,
  ) {
    return this.subService.deleteOne(user.userId, Number(id));
  }
}
