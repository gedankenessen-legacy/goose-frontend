import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoginService } from '../login.service';
import { LoginContent } from '../LoginContent';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-logindashboard',
  templateUrl: './logindashboard.component.html',
  styleUrls: ['./logindashboard.component.less'],
})
export class LogindashboardComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private router: Router,
    private authService: AuthService,
    private appComponent: AppComponent
  ) {}

  loginForm: FormGroup;
  companyId: number;
  visible: Boolean = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  hideError() {
    this.visible = false;
  }

  submitForm() {
    let logincontent: LoginContent = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    };
    this.login(logincontent);
  }

  login(logincontent: LoginContent) {
    this.authService
      .login(logincontent.username, logincontent.password)
      .subscribe(
        (data) => {
          this.appComponent.loadTokens();
          this.router.navigateByUrl(`${data.companies[0].id}/projects`);
        },
        (error) => {
          this.visible = true;
        }
      );
  }
}
