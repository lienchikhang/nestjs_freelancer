import { Body, Controller, HttpCode, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto, UserLoginDto } from 'src/libs/dto/user.dto';
import AuthGuard from 'src/libs/guards/auth.guard';
import AuthInterceptor from 'src/libs/interceptors/auth.interceptor';

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
  login(
    @Body() data: UserLoginDto
  ) {
    return this.authService.login(data);
  }

  @Post('test')
  @UseInterceptors(AuthInterceptor)
  // @UseGuards(AuthGuard)
  test() {
    return 'okau';
  }
}