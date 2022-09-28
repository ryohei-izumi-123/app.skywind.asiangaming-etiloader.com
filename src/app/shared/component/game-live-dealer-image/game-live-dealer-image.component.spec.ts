import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLiveDealerImageComponent } from './game-live-dealer-image.component';

describe('GameLiveDealerImageComponent', () => {
  let component: GameLiveDealerImageComponent;
  let fixture: ComponentFixture<GameLiveDealerImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameLiveDealerImageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLiveDealerImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
