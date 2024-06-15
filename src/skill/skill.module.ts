import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import ResponseService from 'src/libs/services/response.service';
import SlugService from 'src/libs/services/slug.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';

@Module({
  controllers: [SkillController],
  providers: [
    SkillService,
    ResponseService,
    SlugService,
    ErrorHandlerService,
  ],
})
export class SkillModule { }
