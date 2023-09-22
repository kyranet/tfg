import { TestBed } from '@angular/core/testing';

import { PartenariadoVerGuard } from './partenariado-ver.guard';

describe('PartenariadoVerGuard', () => {
  let guard: PartenariadoVerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PartenariadoVerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
