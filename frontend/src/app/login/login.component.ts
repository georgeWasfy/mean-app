import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, NgIf],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  validationMessages: { [key: string]: string } = {
    required: 'Field is required.',
    minlength: 'Field must be at least 6 characters long.',
    maxlength: 'Field cannot exceed 20 characters.',
    email: 'Must be a valid Email'
  };
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    const token = this.authService.getToken()
    if (token) {
      this.router.navigate(['/home']);
    }
  }
  getErrorMessage(controlName: string): string | null {
    const control = this.loginForm.get(controlName);
    if (control && control.invalid && control.touched) {
      const errors = control.errors;
      if (errors) {
        const errorKeys = Object.keys(errors);
        return this.validationMessages[errorKeys[0]] || 'Invalid input.';
      }
    }
    return null;
  }
  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        const response = await this.authService.login(email, password);
        if (response && response.user?.access_token) {
          this.authService.saveToken(response.user.access_token);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      } catch (error) {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    }
  }
}
