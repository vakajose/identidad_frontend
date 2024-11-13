import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuthorizedConsumersComponent } from './view-authorized-consumers.component';

describe('ViewAuthorizedConsumersComponent', () => {
  let component: ViewAuthorizedConsumersComponent;
  let fixture: ComponentFixture<ViewAuthorizedConsumersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAuthorizedConsumersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAuthorizedConsumersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
