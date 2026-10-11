import { Test, TestingModule } from '@nestjs/testing';
import { OrgnizationController } from './orgnization.controller';
import { OrgnizationService } from './orgnization.service';

describe('OrgnizationController', () => {
  let controller: OrgnizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgnizationController],
      providers: [OrgnizationService],
    }).compile();

    controller = module.get<OrgnizationController>(OrgnizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
