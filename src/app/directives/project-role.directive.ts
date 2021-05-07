import { Directive, ElementRef, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ProjectUserService } from '../project/project-user.service';
import { IdentityService } from '../services/identity.service';
import { SubscriptionWrapper } from '../SubscriptionWrapper';

@Directive({
  selector: '[appProjectRole]',
})
export class ProjectRoleDirective extends SubscriptionWrapper {
  @Input() roles: string[];

  constructor(
    private identity: IdentityService,
    private users: ProjectUserService,
    private elementRef: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    this.subscribe(
      forkJoin([
        this.identity.projectId.asObservable(),
        this.identity.userId.asObservable(),
      ]).pipe(
        switchMap((data) => this.users.getProjectUser(...data)),
        tap(
          (user) =>
            (this.elementRef.nativeElement.style.display = user.roles.some(
              (r) => this.roles.includes(r.id)
            )
              ? 'block'
              : 'none')
        )
      )
    );
  }
}
