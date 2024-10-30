import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeConsumerComponent } from './authorize-consumer.component';

describe('AuthorizeConsumerComponent', () => {
  let component: AuthorizeConsumerComponent;
  let fixture: ComponentFixture<AuthorizeConsumerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizeConsumerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeConsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
