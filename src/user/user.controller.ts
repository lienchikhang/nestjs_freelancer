import { Body, Controller, Get, HttpCode, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/libs/decorators/user.decorator';
import AuthGuard from 'src/libs/guards/auth.guard';
import { UserUpdateDto } from 'src/libs/dto';
import RenewalInterceptor from 'src/libs/interceptors/renewal.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('getInfo')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(RenewalInterceptor)
  getInfo(
    @User() user,
  ) {
    return this.userService.getInfo(user.userId);
  }

  @Patch('update')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(RenewalInterceptor)
  updateInfo(
    @User() user,
    @Body() data: UserUpdateDto,
  ) {
    return this.userService.updateInfo(user.userId, data);
  }

  @Patch('active')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(RenewalInterceptor)
  activeSeller(
    @User() user,
  ) {
    return this.userService.active(user.userId);
  }
}
