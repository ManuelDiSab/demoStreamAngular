import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiaListaComponent } from './mia-lista.component';

describe('MiaListaComponent', () => {
  let component: MiaListaComponent;
  let fixture: ComponentFixture<MiaListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiaListaComponent]
    });
    fixture = TestBed.createComponent(MiaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
