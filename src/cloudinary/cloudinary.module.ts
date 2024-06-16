import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  exports: [CloudinaryService],
  providers: [CloudinaryService],
})
export class CloudinaryModule { }
