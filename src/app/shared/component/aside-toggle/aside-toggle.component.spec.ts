import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideToggleComponent } from './aside-toggle.component';

describe('AsideToggleComponent', () => {
  let component: AsideToggleComponent;
  let fixture: ComponentFixture<AsideToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AsideToggleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
