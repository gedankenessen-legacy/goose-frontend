import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogindashboardComponent } from './logindashboard/logindashboard.component';


const routes: Routes = [
    {
        path: 'user',
        component: LogindashboardComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }