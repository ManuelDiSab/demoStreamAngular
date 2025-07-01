import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneUtentiComponent } from './gestione-utenti.component';

describe('GestioneUtentiComponent', () => {
  let component: GestioneUtentiComponent;
  let fixture: ComponentFixture<GestioneUtentiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestioneUtentiComponent]
    });
    fixture = TestBed.createComponent(GestioneUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
