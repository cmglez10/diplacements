import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplacementsComponent } from './displacements.component';

describe('DisplacementsComponent', () => {
  let component: DisplacementsComponent;
  let fixture: ComponentFixture<DisplacementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplacementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplacementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
