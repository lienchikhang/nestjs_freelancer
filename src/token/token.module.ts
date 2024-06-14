import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';

@Module({
  exports: [TokenService],
  providers: [TokenService, ErrorHandlerService,]
})
export class TokenModule { }
