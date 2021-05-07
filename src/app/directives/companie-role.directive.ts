import { Directive, ElementRef, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CompanyUserService } from '../company/company-user.service';
import { IdentityService } from '../services/identity.service';
import { SubscriptionWrapper } from '../SubscriptionWrapper';

@Directive({
  selector: '[appCompanieRole]'
})
export class CompanieRoleDirective extends SubscriptionWrapper {

  @Input() roles: string[];

  constructor(
    private identity: IdentityService,
    private users: CompanyUserService,
    private elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    this.subscribe(
      forkJoin([
        this.identity.companyId.asObservable(),
        this.identity.userId.asObservable()
      ]).pipe(
        switchMap(data => this.users.getCompanyUser(...data)),
        tap(user =>
          this.elementRef.nativeElement.style.display = user.roles.some(r => this.roles.includes(r.id)) ? 'block' : 'none'
        )
      )
    );
  }
}
