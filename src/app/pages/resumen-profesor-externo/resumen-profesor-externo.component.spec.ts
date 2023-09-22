import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenProfesorExternoComponent } from './resumen-profesor-externo.component';

describe('ResumenProfesorExternoComponent', () => {
  let component: ResumenProfesorExternoComponent;
  let fixture: ComponentFixture<ResumenProfesorExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenProfesorExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenProfesorExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
