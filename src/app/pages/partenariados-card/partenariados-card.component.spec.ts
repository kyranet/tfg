import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenariadosCardComponent } from './partenariados-card.component';

describe('PartenariadosCardComponent', () => {
  let component: PartenariadosCardComponent;
  let fixture: ComponentFixture<PartenariadosCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartenariadosCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartenariadosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
