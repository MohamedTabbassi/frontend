import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceAutoComponent } from './piece-auto.component';

describe('PieceAutoComponent', () => {
  let component: PieceAutoComponent;
  let fixture: ComponentFixture<PieceAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceAutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieceAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
