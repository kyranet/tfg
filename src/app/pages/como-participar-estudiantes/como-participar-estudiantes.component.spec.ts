import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoParticiparEstudiantesComponent } from './como-participar-estudiantes.component';

xdescribe('ComoParticiparEstudiantesComponent', () => {
  let component: ComoParticiparEstudiantesComponent;
  let fixture: ComponentFixture<ComoParticiparEstudiantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComoParticiparEstudiantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComoParticiparEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
