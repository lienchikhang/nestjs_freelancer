import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import SlugService from 'src/libs/services/slug.service';
import { CheckService } from 'src/libs/services/check.service';

@Module({
  controllers: [SkillController],
  providers: [
    SkillService,
    SlugService,
    CheckService,
  ],
})
export class SkillModule { }
