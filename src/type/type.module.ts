import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import SlugService from 'src/libs/services/slug.service';

@Module({
  controllers: [TypeController],
  providers: [TypeService, SlugService],
})
export class TypeModule { }
