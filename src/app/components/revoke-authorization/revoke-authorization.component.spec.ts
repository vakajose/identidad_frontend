import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeAuthorizationComponent } from './revoke-authorization.component';

describe('RevokeAuthorizationComponent', () => {
  let component: RevokeAuthorizationComponent;
  let fixture: ComponentFixture<RevokeAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevokeAuthorizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevokeAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
