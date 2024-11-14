import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPostComponent } from './final-post.component';

describe('FinalPostComponent', () => {
  let component: FinalPostComponent;
  let fixture: ComponentFixture<FinalPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
