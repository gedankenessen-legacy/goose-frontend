import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/interfaces/User';
import { RegisterService } from '../register.service';
import { RegisterContent } from '../RegisterContent';

@Component({
  selector: 'app-registerdashboard',
  templateUrl: './registerdashboard.component.html',
  styleUrls: ['./registerdashboard.component.less'],
})
export class RegisterdashboardComponent implements OnInit {
  registerForm: FormGroup;
  retUsername: string;
  companyId: string;

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      companyname: new FormControl('', [Validators.required]), //schon vorhandener Firmenname Error behandeln
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      password1: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'),
      ]),
      password2: new FormControl('', [this.passwordMatch]),
    });
  }

  submitForm() {
    let registercontent: RegisterContent = {
      firstname: this.registerForm.get('firstname').value,
      lastname: this.registerForm.get('lastname').value,
      password: this.registerForm.get('password1').value,
      companyName: this.registerForm.get('companyname').value,
    };
    this.register(registercontent);
  }

  register(registercontent: RegisterContent) {
    this.service.register(registercontent).subscribe(
      (data) => {
        this.retUsername = data.user.username;
        this.companyId = data.companies[0].id;
        console.log(this.companyId);
        this.authService.loginAfterRegister(
          data.user.id,
          data.user.username,
          data.user.firstname,
          data.user.lastname,
          data.token,
          this.companyId,
          this.registerForm.get('companyname').value
        );
        this.router.navigateByUrl(`${this.companyId}/projects`);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  passwordMatch = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.registerForm.controls.password1.value) {
      return { error: true, passwordMatch: true };
    }
    return {};
  };
}
