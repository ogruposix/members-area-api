import { Test, TestingModule } from '@nestjs/testing';
import { EbookService } from './ebook.service';

describe('EbookService', () => {
  let service: EbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EbookService],
    }).compile();

    service = module.get<EbookService>(EbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
