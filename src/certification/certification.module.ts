import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';
import SlugService from 'src/libs/services/slug.service';
import ResponseService from 'src/libs/services/response.service';

@Module({
  controllers: [CertificationController],
  providers: [CertificationService, ErrorHandlerService, SlugService, ResponseService],
})
export class CertificationModule { }
