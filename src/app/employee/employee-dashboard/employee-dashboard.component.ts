import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CompanyUserService } from 'src/app/company/company-user.service';
import { CompanyUser } from 'src/app/interfaces/company/CompanyUser';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.less'],
})
export class EmployeeDashboardComponent
  extends SubscriptionWrapper
  implements OnInit {

  companyId: string;
  employees: CompanyUser[] = [];
  isCompany: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private companyUserService: CompanyUserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.subscribe(
      this.companyUserService.getCompanyUsers(this.companyId).pipe(
        tap((data) => {
          this.employees = data.filter((d) => this.filterIsEmployee(d));
          this.isCompany = data
            .filter(
              (d) => d.user.id === this.authService.currentUserValue.id
            )[0]
            ?.roles.some((v) => v.name === 'Firma');
        })
      )
    );
  }

  filterIsEmployee(data: CompanyUser): boolean {
    return !data.roles.some((v) => v.name === 'Kunde' || v.name === 'Firma');
  }
}
