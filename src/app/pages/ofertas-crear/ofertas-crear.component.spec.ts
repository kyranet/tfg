import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaCrearComponent } from './ofertas-crear.component';

describe('OfertaCrearComponent', () => {
  let component: OfertaCrearComponent;
  let fixture: ComponentFixture<OfertaCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertaCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
