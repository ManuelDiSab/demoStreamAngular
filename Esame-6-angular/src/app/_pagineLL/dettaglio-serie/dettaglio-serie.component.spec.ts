import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioSerieComponent } from './dettaglio-serie.component';

describe('DettaglioSerieComponent', () => {
  let component: DettaglioSerieComponent;
  let fixture: ComponentFixture<DettaglioSerieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DettaglioSerieComponent]
    });
    fixture = TestBed.createComponent(DettaglioSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
