import { Test, TestingModule } from '@nestjs/testing';
import { IamController } from './iam.controller.js';
import { IamService } from './iam.service.js';

describe('IamController', () => {
  let controller: IamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IamController],
      providers: [IamService],
    }).compile();

    controller = module.get<IamController>(IamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
