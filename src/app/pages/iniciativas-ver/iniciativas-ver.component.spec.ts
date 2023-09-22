import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciativasVerComponent } from './iniciativas-ver.component';

describe('IniciativasVerComponent', () => {
  let component: IniciativasVerComponent;
  let fixture: ComponentFixture<IniciativasVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IniciativasVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciativasVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
