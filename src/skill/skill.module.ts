import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import SlugService from 'src/libs/services/slug.service';

@Module({
  controllers: [SkillController],
  providers: [
    SkillService,
    SlugService,
  ],
})
export class SkillModule { }
