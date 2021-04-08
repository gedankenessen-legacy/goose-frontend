import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
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
  

  constructor(private fb: FormBuilder, private service: RegisterService, private router:Router) { }

  ngOnInit(): void { 
    this.registerForm = this.fb.group({
      companyname: new FormControl('',[Validators.required]), //schon vorhandener Firmenname Error fehlt
      firstname: new FormControl('',[Validators.required]),
      lastname: new FormControl('',[Validators.required]),
      password1: new FormControl('', [Validators.required, 
      Validators.pattern('^(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]),
      password2: new FormControl('', [this.passwordMatch])
      }); 
  }

  handleOk(): void {
    //console.log('Button ok clicked!');
    this.isVisible = false;
    this.router.navigateByUrl['/login'];
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
    console.log(registercontent);
    this.register(registercontent);
  }

  register(registercontent: RegisterContent){
    this.service.register(registercontent).subscribe(
      (data)=>{
        //this.router.navigateByUrl('/')
        console.log(data);
        this.retUsername = data.user.username;
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
