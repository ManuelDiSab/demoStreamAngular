import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneSerieComponent } from './gestione-serie.component';

describe('GestioneSerieComponent', () => {
  let component: GestioneSerieComponent;
  let fixture: ComponentFixture<GestioneSerieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestioneSerieComponent]
    });
    fixture = TestBed.createComponent(GestioneSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
