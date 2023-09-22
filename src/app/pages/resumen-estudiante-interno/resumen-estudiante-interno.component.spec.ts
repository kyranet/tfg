import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenEstudianteInternoComponent } from './resumen-estudiante-interno.component';

describe('ResumenEstudianteInternoComponent', () => {
  let component: ResumenEstudianteInternoComponent;
  let fixture: ComponentFixture<ResumenEstudianteInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenEstudianteInternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenEstudianteInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
