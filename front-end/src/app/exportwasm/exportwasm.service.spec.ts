import { TestBed, inject } from '@angular/core/testing';

import { ExportwasmService } from './exportwasm.service';

describe('ExportwasmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportwasmService]
    });
  });

  it('should be created', inject([ExportwasmService], (service: ExportwasmService) => {
    expect(service).toBeTruthy();
  }));
});
