import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';

import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { StateService } from 'src/app/project/state.service';
import { ProjectService } from 'src/app/project/project.service';
import { State } from 'src/app/interfaces/project/State';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/interfaces/User';
import { IssueDashboardContent } from 'src/app/interfaces/issue/IssueDashboardContent';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(private issueService: IssueService, 
    private stateService: StateService,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {

    //forkJoin([this.getAllIssues()]).subscribe(() => this.processContent());
    this.getAllIssues(); 
  }

  listOfIssues: Issue[];
  /*listOfStates: Map<string, State> = new Map<string, State>();
  listOfAuthors: Map<string, User> = new Map<string, User>();
  listOfDashboardContent: IssueDashboardContent[];

  private processContent() {
    console.log(this.listOfAuthors);
    console.log(this.listOfIssues);
    this.listOfDashboardContent = this.listOfIssues.map(issue => {
      //const issues: Issue[] = this.listOfIssues.get(project.id);

      return {
        id: issue.id,
        name: issue.name,
        author: this.listOfAuthors.get(issue.authorId).firstname + " " + this.listOfAuthors.get(issue.authorId).lastname,
        progress: issue.progress,
        state: this.listOfStates.get(issue.stateId).name,
        startDate: issue.startDate,
        endDate: issue.endDate,
        priority: issue.priority,
      }
    });
  }*/

  getAllIssues() {
    const companyId = this.route.snapshot.paramMap.get('projectId'); 
    this.issueService.getIssues(companyId).subscribe(
      (data) => {
        this.listOfIssues = data;
    },
      (error) => {
        console.error(error);
      })
    /*return this.issueService.getIssues(companyId).pipe(
      tap(issues => this.listOfIssues = issues),
      switchMap((issues: Issue[]) => {
        const ids = issues.map(issue => issue.id);
        const authIds = issues.map(issue => issue.authorId)


        const issueState = ids.map(
          id => this.stateService.getState(companyId, id).pipe(tap(issuesState => this.listOfStates.set(id, issuesState))));

        const issueAuthor = authIds.map(
          authId => this.userService.getUser(authId).pipe(tap(issuesAuthor => this.listOfAuthors.set(authId, issuesAuthor))));

        return forkJoin([forkJoin(issueState),forkJoin(issueAuthor)]).pipe(map(() => null));
      })
    );*/
  }


}
