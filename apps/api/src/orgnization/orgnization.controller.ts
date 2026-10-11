import { Controller } from '@nestjs/common';
import { OrgnizationService } from './orgnization.service';

@Controller('orgnization')
export class OrgnizationController {
  constructor(private readonly orgnizationService: OrgnizationService) {}
}
