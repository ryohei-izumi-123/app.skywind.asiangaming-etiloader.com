import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameThumbListComponent } from './game-thumb-list.component';

describe('GameThumbListComponent', () => {
  let component: GameThumbListComponent;
  let fixture: ComponentFixture<GameThumbListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameThumbListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameThumbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
