import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CompanyUserService } from 'src/app/company/company-user.service';
import { CustomerRole, Role } from 'src/app/interfaces/Role';
import { RoleService } from 'src/app/role.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';

@Component({
  selector: 'app-customer-settings',
  templateUrl: './customer-settings.component.html',
  styleUrls: ['./customer-settings.component.less']
})
export class CustomerSettingsComponent extends SubscriptionWrapper implements OnInit {
  companyId: string;
  customerId: string;
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
    this.customerId = this.route.snapshot.paramMap.get('customerId');

    this.subscribe(
      this.roleService.getRoles().pipe(tap((data) => (this.roles = data)))
    );

    if (this.customerId) {
      this.subscribe(
        this.companyUserService
          .getCompanyUser(this.companyId, this.customerId)
          .pipe(
            tap((customer) => {
              this.form.patchValue({ ...customer.user, roles: customer.roles });
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
        this.roles.find((role) => role.name == CustomerRole),
      ],
    };

    this.subscribe(
      (this.customerId
        ? this.companyUserService.updateCompanyUser(
          this.companyId,
          this.customerId,
          employee
        )
        : this.companyUserService.createCompanyUser(this.companyId, employee)
      ).pipe(
        tap((data) => {
          this.router.navigateByUrl(`${this.companyId}/customers`);
        })
      )
    );
  }
}
