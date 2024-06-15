import { Global, Module } from '@nestjs/common';
import { ErrorHandlerService } from './error-handler.service';

@Global()
@Module({
  exports: [ErrorHandlerService],
  providers: [ErrorHandlerService],
})
export class ErrorHandlerModule { }
