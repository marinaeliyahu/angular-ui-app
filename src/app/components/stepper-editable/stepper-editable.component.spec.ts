import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperEditableComponent } from './stepper-editable.component';

describe('StepperEditableComponent', () => {
  let component: StepperEditableComponent;
  let fixture: ComponentFixture<StepperEditableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperEditableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
