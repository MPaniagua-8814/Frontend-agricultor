import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePesajeComponent } from './detalle-pesaje.component';

describe('DetallePesajeComponent', () => {
  let component: DetallePesajeComponent;
  let fixture: ComponentFixture<DetallePesajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePesajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePesajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
