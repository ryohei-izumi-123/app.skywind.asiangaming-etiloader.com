import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameThumbLimitsComponent } from './game-thumb-limits.component';

describe('GameThumbLimitsComponent', () => {
  let component: GameThumbLimitsComponent;
  let fixture: ComponentFixture<GameThumbLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameThumbLimitsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameThumbLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
