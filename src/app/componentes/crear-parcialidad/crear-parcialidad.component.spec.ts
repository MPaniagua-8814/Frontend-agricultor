import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearParcialidadComponent } from './crear-parcialidad.component';

describe('CrearParcialidadComponent', () => {
  let component: CrearParcialidadComponent;
  let fixture: ComponentFixture<CrearParcialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearParcialidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearParcialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
