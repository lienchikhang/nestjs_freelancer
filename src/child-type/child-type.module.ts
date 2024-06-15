import { Module } from '@nestjs/common';
import { ChildTypeService } from './child-type.service';
import { ChildTypeController } from './child-type.controller';
import SlugService from 'src/libs/services/slug.service';

@Module({
  controllers: [ChildTypeController],
  providers: [ChildTypeService, SlugService],
})
export class ChildTypeModule { }
