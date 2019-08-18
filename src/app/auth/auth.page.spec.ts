import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { AuthPage } from './auth.page';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

class MockAuthService {
  $currentAuthUser = new BehaviorSubject(undefined);
}

fdescribe('AuthPage', () => {
  let component: AuthPage;
  let fixture: ComponentFixture<AuthPage>;
  let routerSpy: Router;
  let authServiceSpy: AuthService;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ AuthPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: MockAuthService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AuthPage);
    component = fixture.componentInstance;
    authServiceSpy = fixture.debugElement.injector.get(AuthService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load auth user', () => {
    pending();
  });

  it('should go to the sign in page when no user is logged in', () => {
    pending();
  });

  it('should go to trash selection page when no user is logged in', () => {
    pending();
  });
});
