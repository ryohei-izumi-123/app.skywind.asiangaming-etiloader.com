import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameThumbOfflineComponent } from './game-thumb-offline.component';

describe('GameThumbOfflineComponent', () => {
  let component: GameThumbOfflineComponent;
  let fixture: ComponentFixture<GameThumbOfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameThumbOfflineComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameThumbOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
