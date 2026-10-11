import { Test, TestingModule } from '@nestjs/testing';
import { OrgnizationService } from './orgnization.service';

describe('OrgnizationService', () => {
  let service: OrgnizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgnizationService],
    }).compile();

    service = module.get<OrgnizationService>(OrgnizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
