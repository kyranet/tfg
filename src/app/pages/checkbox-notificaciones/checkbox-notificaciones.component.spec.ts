import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxNotificacionesComponent } from './checkbox-notificaciones.component';

describe('CheckboxNotificacionesComponent', () => {
  let component: CheckboxNotificacionesComponent;
  let fixture: ComponentFixture<CheckboxNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxNotificacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
