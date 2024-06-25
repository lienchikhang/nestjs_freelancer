import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ICheckValid, UserCreateDto, UserLoginDto } from 'src/libs/dto/user.dto';
import AuthGuard from 'src/libs/guards/auth.guard';
import AuthInterceptor from 'src/libs/interceptors/auth.interceptor';
import { User } from 'src/libs/decorators/user.decorator';
import RenewalInterceptor from 'src/libs/interceptors/renewal.interceptor';
import { TokenGuard } from 'src/libs/guards/validToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(201)
  register(
    @Body() body: UserCreateDto
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  @UseInterceptors(AuthInterceptor)
  login(
    @Body() data: UserLoginDto
  ) {
    console.log({ data })
    return this.authService.login(data);
  }

  @Post('test')
  @UseGuards(AuthGuard)
  @UseInterceptors(RenewalInterceptor)
  test(
    @User() user,
  ) {
    console.log('req', user);
    return 'okau';
  }

  @Get('check')
  @UseGuards(TokenGuard)
  check(
  ) {
    return this.authService.check();
  }
}
