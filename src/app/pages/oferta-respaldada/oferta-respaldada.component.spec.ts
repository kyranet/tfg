import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaRespaldadaComponent } from './oferta-respaldada.component';

describe('OfertaRespaldadaComponent', () => {
  let component: OfertaRespaldadaComponent;
  let fixture: ComponentFixture<OfertaRespaldadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfertaRespaldadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaRespaldadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
