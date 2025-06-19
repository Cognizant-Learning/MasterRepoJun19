import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty username and password', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: '' });
  });

  it('should validate form is invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate form is valid when username and password are provided', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authService.login when form is valid and submitted', () => {
    authService.login.and.returnValue(of({ token: 'fake-token' }));
    
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
