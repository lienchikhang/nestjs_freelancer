import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import SlugService from 'src/libs/services/slug.service';
import PrismaService from 'src/libs/services/prisma.service';
import BcryptService from 'src/libs/services/bcrypt.service';
import ResponseService from 'src/libs/services/response.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';
import { TokenService } from 'src/token/token.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    SlugService,
    PrismaService,
    BcryptService,
    ResponseService,
    ErrorHandlerService,
  ],
})
export class UserModule { }
