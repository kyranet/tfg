import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerirOfertaComponent } from './sugerir-oferta.component';

describe('SugerirOfertaComponent', () => {
  let component: SugerirOfertaComponent;
  let fixture: ComponentFixture<SugerirOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugerirOfertaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SugerirOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
