import { Module } from '@nestjs/common';
import { ChildTypeService } from './child-type.service';
import { ChildTypeController } from './child-type.controller';

@Module({
  controllers: [ChildTypeController],
  providers: [ChildTypeService],
})
export class ChildTypeModule {}
