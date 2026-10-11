import { Controller } from '@nestjs/common';
import { OrgnizationService } from './orgnization.service.js';

@Controller('orgnization')
export class OrgnizationController {
  constructor(private readonly orgnizationService: OrgnizationService) {}
}
