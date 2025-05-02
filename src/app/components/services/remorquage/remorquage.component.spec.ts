import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemorquageComponent } from './remorquage.component';

describe('RemorquageComponent', () => {
  let component: RemorquageComponent;
  let fixture: ComponentFixture<RemorquageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemorquageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemorquageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
