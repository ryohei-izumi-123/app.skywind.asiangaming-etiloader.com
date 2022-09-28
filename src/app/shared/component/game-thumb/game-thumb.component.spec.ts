import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameThumbComponent } from './game-thumb.component';

describe('GameThumbComponent', () => {
  let component: GameThumbComponent;
  let fixture: ComponentFixture<GameThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameThumbComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
