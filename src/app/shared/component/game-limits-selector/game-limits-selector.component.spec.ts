import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLimitsSelectorComponent } from './game-limits-selector.component';

describe('GameLimitsSelectorComponent', () => {
  let component: GameLimitsSelectorComponent;
  let fixture: ComponentFixture<GameLimitsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameLimitsSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLimitsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
