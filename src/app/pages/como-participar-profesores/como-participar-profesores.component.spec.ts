import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoParticiparProfesoresComponent } from './como-participar-profesores.component';

describe('ComoParticiparProfesoresComponent', () => {
  let component: ComoParticiparProfesoresComponent;
  let fixture: ComponentFixture<ComoParticiparProfesoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComoParticiparProfesoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComoParticiparProfesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
