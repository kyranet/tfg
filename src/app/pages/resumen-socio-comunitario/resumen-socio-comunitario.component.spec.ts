import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenSocioComunitarioComponent } from './resumen-socio-comunitario.component';

describe('ResumenSocioComunitarioComponent', () => {
  let component: ResumenSocioComunitarioComponent;
  let fixture: ComponentFixture<ResumenSocioComunitarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenSocioComunitarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenSocioComunitarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
