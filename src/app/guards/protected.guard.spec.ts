import { TestBed } from '@angular/core/testing';

import { ProtectedGuard } from './protected.guard';

xdescribe('ProtectedGuard', () => {
  let guard: ProtectedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProtectedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
