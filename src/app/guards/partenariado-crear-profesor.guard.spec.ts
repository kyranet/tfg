import { TestBed } from '@angular/core/testing';

import { PartenariadoCrearProfesorGuard } from './partenariado-crear-profesor.guard';

describe('PartenariadoCrearProfesorGuard', () => {
  let guard: PartenariadoCrearProfesorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PartenariadoCrearProfesorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
