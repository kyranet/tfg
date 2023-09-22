import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciativasCrearComponent } from './iniciativas-crear.component';

describe('IniciativasCrearComponent', () => {
  let component: IniciativasCrearComponent;
  let fixture: ComponentFixture<IniciativasCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IniciativasCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciativasCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
