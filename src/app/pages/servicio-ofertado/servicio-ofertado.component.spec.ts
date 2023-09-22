import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioOfertadoComponent } from './servicio-ofertado.component';

describe('ServicioOfertadoComponent', () => {
  let component: ServicioOfertadoComponent;
  let fixture: ComponentFixture<ServicioOfertadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicioOfertadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicioOfertadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
