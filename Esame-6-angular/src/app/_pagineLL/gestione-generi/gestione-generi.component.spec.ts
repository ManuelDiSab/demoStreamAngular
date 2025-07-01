import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneGeneriComponent } from './gestione-generi.component';

describe('GestioneGeneriComponent', () => {
  let component: GestioneGeneriComponent;
  let fixture: ComponentFixture<GestioneGeneriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestioneGeneriComponent]
    });
    fixture = TestBed.createComponent(GestioneGeneriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
