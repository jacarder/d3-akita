import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeWeightScatterGraphComponent } from './age-weight-scatter-graph.component';

describe('AgeWeightScatterGraphComponent', () => {
  let component: AgeWeightScatterGraphComponent;
  let fixture: ComponentFixture<AgeWeightScatterGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgeWeightScatterGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeWeightScatterGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
