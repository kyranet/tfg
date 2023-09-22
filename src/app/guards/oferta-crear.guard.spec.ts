import { TestBed } from '@angular/core/testing';

import { OfertaCrearGuard } from './oferta-crear.guard';

xdescribe('OfertaCrearGuard', () => {
  let guard: OfertaCrearGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OfertaCrearGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
