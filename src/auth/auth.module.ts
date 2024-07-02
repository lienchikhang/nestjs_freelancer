import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import SlugService from 'src/libs/services/slug.service';
import BcryptService from 'src/libs/services/bcrypt.service';
import { TokenService } from 'src/token/token.service';
import { FacebookStrategy } from 'src/libs/strategies/Facebook.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'facebook' })],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    SlugService,
    BcryptService,
    TokenService,
    FacebookStrategy,
  ],
})
export class AuthModule { }
