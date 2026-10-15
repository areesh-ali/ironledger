import { Test, TestingModule } from '@nestjs/testing';
import { IamService } from './iam.service';
import { DatabaseService } from '../database/database.service';
import { HashService } from '../common/HashingService/hashing.service';

describe('IamService', () => {
  let service: IamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IamService,
        {
          provide: DatabaseService,
          useValue: { db: {} },
        },
        {
          provide: HashService,
          useValue: {
            createPasswordHash: vi.fn(),
            verifyPassword: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IamService>(IamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
