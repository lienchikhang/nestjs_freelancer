import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import SlugService from 'src/libs/services/slug.service';
import PrismaService from 'src/libs/services/prisma.service';
import BcryptService from 'src/libs/services/bcrypt.service';
import ResponseService from 'src/libs/services/response.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';

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
