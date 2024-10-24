import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [ReactiveFormsModule,RouterOutlet, RouterLink, RouterLinkActive],
})
export class SignupComponent {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.authService.signup(email, password).subscribe(
        response => console.log('Signup successful', response),
        error => console.error('Signup failed', error)
      );
    }
  }
}