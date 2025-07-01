import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneEpisodiComponent } from './gestione-episodi.component';

describe('GestioneEpisodiComponent', () => {
  let component: GestioneEpisodiComponent;
  let fixture: ComponentFixture<GestioneEpisodiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestioneEpisodiComponent]
    });
    fixture = TestBed.createComponent(GestioneEpisodiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
