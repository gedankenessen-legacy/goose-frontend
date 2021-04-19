import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { empty } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CompanyUserService } from 'src/app/company/company-user.service';
import { CompanyUser } from 'src/app/interfaces/company/CompanyUser';
import { Role } from 'src/app/interfaces/Role';
import { RoleService } from 'src/app/role.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.less']
})
export class EmployeeSettingsComponent extends SubscriptionWrapper implements OnInit {

  companyId: string;
  employeeId: string;
  roles: Role[];

  form: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    // TODO: PW Validatoren
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    roles: new FormControl(),
  });

  constructor(private router: Router, private route: ActivatedRoute, private companyUserService: CompanyUserService, private roleService: RoleService) {
    super();
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.employeeId = this.route.snapshot.paramMap.get('employeeId');

    this.subscribe(this.roleService.getRoles().pipe(tap(data => this.roles = data)));

    if (this.employeeId) {
      this.subscribe(this.companyUserService.getCompanyUser(this.companyId, this.employeeId)
        .pipe(tap(employee => {
          this.form.patchValue({ ...(employee.user), roles: employee.roles });
        })));
    }
  }

  save(): void {
    const employee = {
      firstname: this.form.get('firstname').value,
      lastname: this.form.get('lastname').value,
      password: this.form.get('password').value,
      // TODO: Hole Rolle korrekt
      roles: [(this.form.get('roles').value ?? this.roles.find(role => role.name == "Mitarbeiter"))]
    };

    this.subscribe(((this.employeeId) ?
      this.companyUserService.updateCompanyUser(this.companyId, this.employeeId, employee) :
      this.companyUserService.createCompanyUser(this.companyId, employee))
      .pipe(tap(data => { this.router.navigateByUrl(`${this.companyId}/employees`); })));
  }
}
