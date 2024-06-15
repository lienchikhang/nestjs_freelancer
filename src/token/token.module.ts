import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';

@Global()
@Module({
  exports: [TokenService],
  providers: [TokenService, ErrorHandlerService,]
})
export class TokenModule { }
