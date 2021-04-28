import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CompanyUserService } from 'src/app/company/company-user.service';
import { Role } from 'src/app/interfaces/Role';
import { RoleService } from 'src/app/role.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.less'],
})
export class EmployeeSettingsComponent
  extends SubscriptionWrapper
  implements OnInit {
  companyId: string;
  employeeId: string;
  roles: Role[];

  // TODO: Password Match in Validator auslagern (+fix)
  passwordMatch = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.form.controls.confirmPassword.value) {
      return { error: true, passwordMatch: true };
    }
    return {};
  };

  form: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      this.passwordMatch,
    ]),
    roles: new FormControl(),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyUserService: CompanyUserService,
    private roleService: RoleService
  ) {
    super();
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.employeeId = this.route.snapshot.paramMap.get('employeeId');

    this.subscribe(
      this.roleService.getRoles().pipe(tap((data) => (this.roles = data)))
    );

    if (this.employeeId) {
      this.subscribe(
        this.companyUserService
          .getCompanyUser(this.companyId, this.employeeId)
          .pipe(
            tap((employee) => {
              this.form.patchValue({ ...employee.user, roles: employee.roles });
            })
          )
      );
    }
  }

  save(): void {
    const employee = {
      firstname: this.form.get('firstname').value,
      lastname: this.form.get('lastname').value,
      password: this.form.get('password').value,
      // TODO: Hole Rolle korrekt
      roles: [
        this.form.get('roles').value ??
          this.roles.find((role) => role.name == 'Mitarbeiter'),
      ],
    };

    this.subscribe(
      (this.employeeId
        ? this.companyUserService.updateCompanyUser(
            this.companyId,
            this.employeeId,
            employee
          )
        : this.companyUserService.createCompanyUser(this.companyId, employee)
      ).pipe(
        tap((data) => {
          this.router.navigateByUrl(`${this.companyId}/employees`);
        })
      )
    );
  }
}
