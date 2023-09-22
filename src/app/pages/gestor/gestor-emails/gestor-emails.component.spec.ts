import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorEmailsComponent } from './gestor-emails.component';

describe('GestorEmailsComponent', () => {
  let component: GestorEmailsComponent;
  let fixture: ComponentFixture<GestorEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestorEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestorEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
