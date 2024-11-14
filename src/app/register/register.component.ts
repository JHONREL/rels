import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NgForm,
  FormsModule,
} from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, NavbarComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  signupForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  signup() {
    if (this.signupForm.valid) {
      const data = this.signupForm.value;
      console.log(data);
      this.authenticationService.registration(data).subscribe((result) => {
        localStorage.setItem('id', result);
        this.router.navigate(['/homepage']);
      });
    }
  }
}
