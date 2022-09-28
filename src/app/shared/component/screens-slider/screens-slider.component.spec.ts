import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreensSliderComponent } from './screens-slider.component';

describe('ScreensSliderComponent', () => {
  let component: ScreensSliderComponent;
  let fixture: ComponentFixture<ScreensSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScreensSliderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreensSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
