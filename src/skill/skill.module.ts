import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import PrismaService from 'src/libs/services/prisma.service';
import ResponseService from 'src/libs/services/response.service';
import SlugService from 'src/libs/services/slug.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';

@Module({
  controllers: [SkillController],
  providers: [
    SkillService,
    PrismaService,
    ResponseService,
    SlugService,
    ErrorHandlerService,
  ],
})
export class SkillModule { }
