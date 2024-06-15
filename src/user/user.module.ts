import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import SlugService from 'src/libs/services/slug.service';
import BcryptService from 'src/libs/services/bcrypt.service';
import { TokenService } from 'src/token/token.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    SlugService,
    BcryptService,
  ],
})
export class UserModule { }
