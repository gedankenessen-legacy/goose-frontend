import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-registerdashboard',
  templateUrl: './registerdashboard.component.html',
  styleUrls: ['./registerdashboard.component.less']
})
export class RegisterdashboardComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private service: RegisterService, private router:Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: new FormControl('',[Validators.required]),
      password1: new FormControl('', [Validators.required]),
      password2: new FormControl('', [this.passwordMatch])
      });    
  }

  submitForm(){
    /*this.service.register(this.registerForm.get('name').value, this.registerForm.get('password1').value).subscribe(
        (data)=>{
          this.router.navigateByUrl('/')
        },
        (error) =>{
          console.error(error);
        }
      )*/
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
