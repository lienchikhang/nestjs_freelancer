import { Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ChildTypeService } from './child-type.service';
import { Auth } from 'src/libs/decorators/common.decorator';
import { User } from 'src/libs/decorators/user.decorator';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';
import { ChildTypeCreateDto } from 'src/libs/dto';

@Controller('child-type')
export class ChildTypeController {
  constructor(private readonly childTypeService: ChildTypeService) { }

  @Get('get-all/:typeId')
  @HttpCode(200)
  getAll(
    @Param('typeId') typeId: string,
  ) {
    return this.childTypeService.getAllByTypeId(Number(typeId));
  }

  @Post('add')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.ADMIN, ROLE.USER]))
  @Auth()
  add(
    @Body() data: ChildTypeCreateDto,
    @User() user,
  ) {
    return this.childTypeService.addOne(user.userId, data);
  }

  @Patch('delete/:id')
  @HttpCode(200)
  @UseGuards(new RoleAuth([ROLE.ADMIN]))
  @Auth()
  delete(
    @Param('id') id: string,
    @User() user,
  ) {
    return this.childTypeService.deleteOne(user.userId, Number(id));
  }
}
