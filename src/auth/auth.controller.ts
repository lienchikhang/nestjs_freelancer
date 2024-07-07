import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ICheckValid, UserCreateDto, UserLoginDto } from 'src/libs/dto/user.dto';
import MyAuthGuard from 'src/libs/guards/auth.guard';
import AuthInterceptor from 'src/libs/interceptors/auth.interceptor';
import { User } from 'src/libs/decorators/user.decorator';
import RenewalInterceptor from 'src/libs/interceptors/renewal.interceptor';
import { TokenGuard } from 'src/libs/guards/validToken.guard';
import { Auth } from 'src/libs/decorators/common.decorator';
import { LogoutGuard } from 'src/libs/guards/logout.guard';
import { LogoutInterceptor } from 'src/libs/interceptors/logout.interceptor';
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';
import { FacebookInterceptor } from 'src/libs/interceptors/facebook.interceptor';

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

  @Post('logout')
  @HttpCode(200)
  @UseGuards(LogoutGuard)
  @UseInterceptors(LogoutInterceptor)
  logout(
    @User() user,
  ) {
    return this.authService.logout(user.userId);
  }

  @Post('test')
  @UseInterceptors(RenewalInterceptor)
  test(
    @User() user,
  ) {
    console.log('req', user);
    return 'okau';
  }

  @Post('check')
  check(
    @Body() body: ICheckValid
  ) {
    console.log('body in cehckd', body);
    return this.authService.check(body);
  }

  @Get("facebook/login")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("facebook/redirect")
  @UseGuards(AuthGuard("facebook"))
  // @UseInterceptors(FacebookInterceptor)
  async facebookLoginRedirect(
    @Req() req: Request,
    @Res() res,
  ): Promise<any> {
    res.redirect(`http://localhost:3000/login?user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
}
