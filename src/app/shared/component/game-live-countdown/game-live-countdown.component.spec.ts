import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLiveCountdownComponent } from './game-live-countdown.component';

describe('GameLiveCountdownComponent', () => {
  let component: GameLiveCountdownComponent;
  let fixture: ComponentFixture<GameLiveCountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameLiveCountdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLiveCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
