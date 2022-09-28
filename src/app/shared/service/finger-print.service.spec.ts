import { TestBed } from '@angular/core/testing';

import { FingerPrintService } from './finger-print.service';

describe('FingerPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FingerPrintService = TestBed.get(FingerPrintService);
    expect(service).toBeTruthy();
  });
});
