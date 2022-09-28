import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameThumbImageComponent } from './game-thumb-image.component';

describe('GameThumbImageComponent', () => {
  let component: GameThumbImageComponent;
  let fixture: ComponentFixture<GameThumbImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameThumbImageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameThumbImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
