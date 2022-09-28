import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLiveDealerComponent } from './game-live-dealer.component';

describe('GameLiveDealerComponent', () => {
  let component: GameLiveDealerComponent;
  let fixture: ComponentFixture<GameLiveDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameLiveDealerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLiveDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
