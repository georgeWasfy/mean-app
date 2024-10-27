import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class SignupComponent {
  signupForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.router.navigate(['/home']);
    }
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