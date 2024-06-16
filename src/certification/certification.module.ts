import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import SlugService from 'src/libs/services/slug.service';
import { CheckService } from 'src/libs/services/check.service';

@Module({
  controllers: [CertificationController],
  providers: [
    CertificationService,
    SlugService,
    CheckService,
  ],
})
export class CertificationModule { }
