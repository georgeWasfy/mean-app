import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    const token = this.authService.getToken()
    if (token) {
      this.router.navigate(['/home']);
    }
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
