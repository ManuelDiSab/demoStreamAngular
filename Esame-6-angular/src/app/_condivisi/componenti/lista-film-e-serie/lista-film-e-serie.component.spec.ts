import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFilmESerieComponent } from './lista-film-e-serie.component';

describe('ListaFilmESerieComponent', () => {
  let component: ListaFilmESerieComponent;
  let fixture: ComponentFixture<ListaFilmESerieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaFilmESerieComponent]
    });
    fixture = TestBed.createComponent(ListaFilmESerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
