import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaCardComponent } from './oferta-card.component';

describe('OfertaCardComponent', () => {
  let component: OfertaCardComponent;
  let fixture: ComponentFixture<OfertaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfertaCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
