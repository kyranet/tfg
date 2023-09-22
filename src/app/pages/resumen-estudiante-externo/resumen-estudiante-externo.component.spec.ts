import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenEstudianteExternoComponent } from './resumen-estudiante-externo.component';

describe('ResumenEstudianteExternoComponent', () => {
  let component: ResumenEstudianteExternoComponent;
  let fixture: ComponentFixture<ResumenEstudianteExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenEstudianteExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenEstudianteExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
