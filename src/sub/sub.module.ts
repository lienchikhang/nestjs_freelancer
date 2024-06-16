import { Module } from '@nestjs/common';
import { SubService } from './sub.service';
import { SubController } from './sub.controller';
import SlugService from 'src/libs/services/slug.service';

@Module({
  controllers: [SubController],
  providers: [SubService, SlugService],
})
export class SubModule { }
