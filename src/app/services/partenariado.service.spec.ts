import { TestBed } from '@angular/core/testing';

import { PartenariadoService } from './partenariado.service';

describe('PartenariadoService', () => {
  let service: PartenariadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartenariadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
