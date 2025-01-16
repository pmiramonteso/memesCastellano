import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMemesComponent } from './admin-memes.component';

describe('AdminMemesComponent', () => {
  let component: AdminMemesComponent;
  let fixture: ComponentFixture<AdminMemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMemesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
