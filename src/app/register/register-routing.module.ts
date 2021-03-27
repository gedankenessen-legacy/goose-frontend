import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterdashboardComponent } from './registerdashboard/registerdashboard.component';


const routes: Routes = [
    {
        path: 'user',
        component: RegisterdashboardComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }