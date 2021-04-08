import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/interfaces/User';
import { RegisterService } from '../register.service';
import { RegisterContent } from '../RegisterContent';

@Component({
  selector: 'app-registerdashboard',
  templateUrl: './registerdashboard.component.html',
  styleUrls: ['./registerdashboard.component.less']
})

export class RegisterdashboardComponent implements OnInit {
  registerForm: FormGroup;
  isVisible = false;
  retUsername: string;
  companyId: number;
  
  constructor(private fb: FormBuilder, private service: RegisterService, private router:Router, private authService: AuthService) {

   }

  ngOnInit(): void { 
    this.registerForm = this.fb.group({
      companyname: new FormControl('',[Validators.required]), //schon vorhandener Firmenname Error behandeln
      firstname: new FormControl('',[Validators.required]),
      lastname: new FormControl('',[Validators.required]),
      password1: new FormControl('', [Validators.required, 
      Validators.pattern('^(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]),
      password2: new FormControl('', [this.passwordMatch])
      }); 
  }

  handleOk(): void {
    this.isVisible = false;
    //let url = '/' +this.companyId +'/projects/';
    //console.log(url);
    this.router.navigateByUrl(`${this.companyId}/projects`);
    //this.router.navigateByUrl[url];
  }
  
  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(){
    let registercontent: RegisterContent ={
      firstname: this.registerForm.get('firstname').value,
      lastname: this.registerForm.get('lastname').value,
      password: this.registerForm.get('password1').value,
      companyName: this.registerForm.get('companyname').value
    }
    //console.log(registercontent);
    this.register(registercontent);
  }

  register(registercontent: RegisterContent){
    this.service.register(registercontent).subscribe(
      (data)=>{
        console.log(data);
        this.retUsername = data.user.username; 
        this.companyId = data.companies[0].id;
        this.authService.loginAfterRegister(data.user.id, data.user.username, data.user.firstname, data.user.lastname, data.token);
        //console.log(this.token);
        //console.log(this.companyId);
        this.isVisible = true;
      },
      (error) =>{
        console.error(error);
      }
    )
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
