import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import SlugService from 'src/libs/services/slug.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, SlugService],
})
export class ServiceModule { }
