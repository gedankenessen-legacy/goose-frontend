import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CompanyUserService } from 'src/app/company/company-user.service';
import { CompanyUser } from 'src/app/interfaces/company/CompanyUser';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.less'],
})
export class EmployeeDashboardComponent
  extends SubscriptionWrapper
  implements OnInit {
  // Create Button

  companyId: string;
  employees: CompanyUser[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyUserService: CompanyUserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.subscribe(
      this.companyUserService
        .getCompanyUsers(this.companyId)
        .pipe(
          tap(
            (data) =>
              (this.employees = data.filter((d) => this.filterNonEmployee(d)))
          )
        )
    );
  }

  filterNonEmployee(data: CompanyUser): boolean {
    return !data.roles.some((v) => v.name === 'Kunde' || v.name === 'Firma');
  }
}
