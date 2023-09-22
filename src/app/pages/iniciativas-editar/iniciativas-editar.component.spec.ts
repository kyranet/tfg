import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciativasEditarComponent } from './iniciativas-editar.component';

describe('IniciativasEditarComponent', () => {
  let component: IniciativasEditarComponent;
  let fixture: ComponentFixture<IniciativasEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IniciativasEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciativasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
