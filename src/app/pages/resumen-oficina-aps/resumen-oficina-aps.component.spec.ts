import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenOficinaApsComponent } from './resumen-oficina-aps.component';

describe('ResumenOficinaApsComponent', () => {
  let component: ResumenOficinaApsComponent;
  let fixture: ComponentFixture<ResumenOficinaApsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenOficinaApsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenOficinaApsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
