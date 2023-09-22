import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreApsUnedQuienesSomosComponent } from './sobre-aps-uned-quienes-somos.component';

describe('SobreApsUnedQuienesSomosComponent', () => {
  let component: SobreApsUnedQuienesSomosComponent;
  let fixture: ComponentFixture<SobreApsUnedQuienesSomosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SobreApsUnedQuienesSomosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SobreApsUnedQuienesSomosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
