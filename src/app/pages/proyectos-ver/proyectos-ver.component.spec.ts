import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosVerComponent } from './proyectos-ver.component';

describe('ProyectosVerComponent', () => {
  let component: ProyectosVerComponent;
  let fixture: ComponentFixture<ProyectosVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
