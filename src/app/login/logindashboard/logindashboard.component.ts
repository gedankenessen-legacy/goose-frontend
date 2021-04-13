import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { LoginContent } from '../LoginContent';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logindashboard',
  templateUrl: './logindashboard.component.html',
  styleUrls: ['./logindashboard.component.less']
})
export class LogindashboardComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: LoginService, private router:Router, private authService: AuthService) { }

  loginForm: FormGroup;
  companyId: number;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
    });
  }

  submitForm() {
    let logincontent:LoginContent ={
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    }
    this.login(logincontent);
  }
  login(logincontent: LoginContent){
    this.service.login(logincontent).subscribe(
      (data)=>{
        this.companyId = data.companies[0].id;
        this.authService.login(data.user.username, data.user.password).subscribe();
        this.router.navigateByUrl(`${this.companyId}/projects`);
        //console.log(this.token);
        //console.log(this.companyId);
      },
      (error) =>{
        console.error(error);
      }
    )
  }
}