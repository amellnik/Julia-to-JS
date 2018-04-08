import { TestBed, inject } from '@angular/core/testing';

import { CharlotteService } from './charlotte.service';

describe('CharlotteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CharlotteService]
    });
  });

  it('should be created', inject([CharlotteService], (service: CharlotteService) => {
    expect(service).toBeTruthy();
  }));
});
