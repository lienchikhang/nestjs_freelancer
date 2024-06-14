import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import SlugService from 'src/libs/services/slug.service';
import PrismaService from 'src/libs/services/prisma.service';
import BcryptService from 'src/libs/services/bcrypt.service';
import ResponseService from 'src/libs/services/response.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';
import { TokenService } from 'src/token/token.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    SlugService,
    PrismaService,
    BcryptService,
    ResponseService,
    ErrorHandlerService,
    TokenService,
  ],
})
export class AuthModule { }
