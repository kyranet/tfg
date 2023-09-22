import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorNewsletterComponent } from './gestor-newsletter.component';

describe('GestorNewsletterComponent', () => {
  let component: GestorNewsletterComponent;
  let fixture: ComponentFixture<GestorNewsletterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestorNewsletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestorNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
