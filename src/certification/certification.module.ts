import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import SlugService from 'src/libs/services/slug.service';

@Module({
  controllers: [CertificationController],
  providers: [
    CertificationService,
    SlugService,
  ],
})
export class CertificationModule { }
