import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocApiComponent } from './doc-api.component';

describe('DocApiComponent', () => {
  let component: DocApiComponent;
  let fixture: ComponentFixture<DocApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
