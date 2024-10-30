import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDocumentComponent } from './register-document.component';

describe('RegisterDocumentComponent', () => {
  let component: RegisterDocumentComponent;
  let fixture: ComponentFixture<RegisterDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
