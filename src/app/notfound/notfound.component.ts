import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.less'],
})
export class NotfoundComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  goBack() {
    if (JSON.parse(localStorage.getItem('token')) == null) {
      this.router.navigateByUrl('login');
    } else {
      this.router.navigateByUrl(
        JSON.parse(localStorage.getItem('companies'))[0].id + '/projects'
      );
    }
  }
}
