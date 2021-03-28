import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-logindashboard',
  templateUrl: './logindashboard.component.html',
  styleUrls: ['./logindashboard.component.less']
})
export class LogindashboardComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: LoginService) { }

  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
    });
  }

  submitForm() {
    this.service.login();
  }

}