import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Goose';
  collapsed = false;

  ngOnInit() {
    this.collapsed = JSON.parse(localStorage.getItem('sidebar_collapse')) ?? false;
  }

  saveCollapse(collapse: boolean): void {
    localStorage.setItem('sidebar_collapse', JSON.stringify(collapse));
  }
}
