import { Global, Module } from '@nestjs/common';
import { CompressService } from './compress.service';

@Global()
@Module({
  exports: [CompressService],
  providers: [CompressService],
})
export class CompressModule { }
