import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosCardComponent } from './proyectos-card.component';

describe('ProyectosCardComponent', () => {
  let component: ProyectosCardComponent;
  let fixture: ComponentFixture<ProyectosCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectosCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
