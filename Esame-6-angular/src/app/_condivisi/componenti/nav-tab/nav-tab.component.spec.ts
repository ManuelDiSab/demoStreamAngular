import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTabComponent } from './nav-tab.component';

describe('NavTabComponent', () => {
  let component: NavTabComponent;
  let fixture: ComponentFixture<NavTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavTabComponent]
    });
    fixture = TestBed.createComponent(NavTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
