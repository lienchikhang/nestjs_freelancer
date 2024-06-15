import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';

@Global()
@Module({
  exports: [TokenService],
  providers: [TokenService,]
})
export class TokenModule { }
