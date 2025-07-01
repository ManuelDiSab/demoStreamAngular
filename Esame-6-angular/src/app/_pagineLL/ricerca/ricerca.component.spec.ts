import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaComponent } from './ricerca.component';

describe('RicercaComponent', () => {
  let component: RicercaComponent;
  let fixture: ComponentFixture<RicercaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RicercaComponent]
    });
    fixture = TestBed.createComponent(RicercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
