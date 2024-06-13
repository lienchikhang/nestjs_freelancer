import { Controller } from '@nestjs/common';
import { CertificationService } from './certification.service';

@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}
}
