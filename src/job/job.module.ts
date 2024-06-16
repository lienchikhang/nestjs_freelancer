import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import SlugService from 'src/libs/services/slug.service';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  controllers: [JobController],
  providers: [JobService, SlugService],
})
export class JobModule { }
