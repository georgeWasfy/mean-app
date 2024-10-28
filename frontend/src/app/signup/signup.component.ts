import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive, NgIf],
})
export class SignupComponent {
  signupForm!: FormGroup;
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
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.signupForm.get(controlName);
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
    if (this.signupForm.valid) {
      const { email, password, name } = this.signupForm.value;

      try {
        const response = await this.authService.signup(email, password, name);
        if (response && response.access_token) {
          this.authService.saveToken(response.access_token);
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