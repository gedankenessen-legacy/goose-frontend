import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Goose';
  collapsed = false;

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.collapsed = JSON.parse(localStorage.getItem('sidebar_collapse')) ?? false;
  }

  saveCollapse(collapse: boolean): void {
    localStorage.setItem('sidebar_collapse', JSON.stringify(collapse));
  }
}
