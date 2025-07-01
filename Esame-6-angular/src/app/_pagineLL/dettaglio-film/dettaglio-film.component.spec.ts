import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioFilmComponent } from './dettaglio-film.component';

describe('DettaglioFilmComponent', () => {
  let component: DettaglioFilmComponent;
  let fixture: ComponentFixture<DettaglioFilmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DettaglioFilmComponent]
    });
    fixture = TestBed.createComponent(DettaglioFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
