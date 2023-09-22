import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenProfesorInternoComponent } from './resumen-profesor-interno.component';

describe('ResumenProfesorInternoComponent', () => {
  let component: ResumenProfesorInternoComponent;
  let fixture: ComponentFixture<ResumenProfesorInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenProfesorInternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenProfesorInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
