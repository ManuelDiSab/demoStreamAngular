import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MioProfiloComponent } from './mio-profilo.component';

describe('MioProfiloComponent', () => {
  let component: MioProfiloComponent;
  let fixture: ComponentFixture<MioProfiloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MioProfiloComponent]
    });
    fixture = TestBed.createComponent(MioProfiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
