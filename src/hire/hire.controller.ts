import { Controller } from '@nestjs/common';
import { HireService } from './hire.service';

@Controller('hire')
export class HireController {
  constructor(private readonly hireService: HireService) {}
}
