import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/auth/auth.service';
import { RegisterService } from '../register.service';
import { RegisterContent } from '../RegisterContent';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-registerdashboard',
  templateUrl: './registerdashboard.component.html',
  styleUrls: ['./registerdashboard.component.less'],
})
export class RegisterdashboardComponent implements OnInit {
  registerForm: FormGroup;
  retUsername: string;
  companyId: string;
  visible: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private router: Router,
    private authService: AuthService,
    private appComponent: AppComponent,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      companyname: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      password1: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'),
      ]),
      password2: new FormControl('', [this.passwordMatch]),
    });
  }

  submitForm(): Boolean {
    if (
      this.registerForm.get('firstname').value == '' ||
      this.registerForm.get('lastname').value == '' ||
      this.registerForm.get('password1').value == '' ||
      this.registerForm.get('password1').value !=
        this.registerForm.get('password2').value ||
      this.registerForm.get('companyname').value == ''
    ) {
      this.visible = true;
      return false;
    }
    let registercontent: RegisterContent = {
      firstname: this.registerForm.get('firstname').value,
      lastname: this.registerForm.get('lastname').value,
      password: this.registerForm.get('password1').value,
      companyName: this.registerForm.get('companyname').value,
    };
    this.register(registercontent);
    return true;
  }

  hideError() {
    this.visible = false;
  }

  register(registercontent: RegisterContent) {
    this.service.register(registercontent).subscribe(
      (data) => {
        this.retUsername = data.user.username;
        this.companyId = data.companies[0].id;
        this.authService.loginAfterRegister(
          data.user.id,
          data.user.username,
          data.user.firstname,
          data.user.lastname,
          data.token,
          this.companyId,
          this.registerForm.get('companyname').value
        );
        this.appComponent.loadTokens();
        this.router.navigateByUrl(`${this.companyId}/projects`);
      },
      (error) => {
        this.modal.error({
          nzTitle: 'Firmenname nicht verfügbar',
          nzContent:
            'Der gewünschte Firmenname ist nicht verfügbar. Bitte wählen Sie einen anderen Firmennamen.',
        });
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
