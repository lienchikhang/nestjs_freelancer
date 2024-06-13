import { Controller } from '@nestjs/common';
import { ChildTypeService } from './child-type.service';

@Controller('child-type')
export class ChildTypeController {
  constructor(private readonly childTypeService: ChildTypeService) {}
}
