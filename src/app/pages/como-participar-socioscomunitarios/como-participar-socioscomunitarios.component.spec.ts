import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoParticiparSociosComunitariosComponent } from './como-participar-socioscomunitarios.component';

describe('ComoParticiparSociosComunitariosComponent', () => {
  let component: ComoParticiparSociosComunitariosComponent;
  let fixture: ComponentFixture<ComoParticiparSociosComunitariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComoParticiparSociosComunitariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComoParticiparSociosComunitariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
