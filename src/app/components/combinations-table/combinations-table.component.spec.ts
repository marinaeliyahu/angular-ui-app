import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinationsTableComponent } from './combinations-table.component';

describe('CombinationsTableComponent', () => {
  let component: CombinationsTableComponent;
  let fixture: ComponentFixture<CombinationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinationsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
