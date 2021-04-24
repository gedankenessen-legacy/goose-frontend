import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/base.service';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueRequirement } from 'src/app/interfaces/issue/IssueRequirement';
import { User } from 'src/app/interfaces/User';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { IssueRequirementsService } from '../issue-requirements.service';
import { IssueSummaryService } from '../issue-summary.service';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less']
})
export class SummaryComponent extends SubscriptionWrapper implements OnInit {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor( private issueRequirementsService: IssueRequirementsService,
    private route: ActivatedRoute,
    private base: BaseService,
    private httpClient: HttpClient,
    private authService: AuthService,
    private issueService: IssueService,
    private router: Router,
    private issueSummaryService: IssueSummaryService) {
      super();
     }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId'); 
    this.companyId = this.route.snapshot.paramMap.get('companyId'); 
    this.getAllRequirements();
    this.expectedTime = 1;
  }

  listOfRequirements: IssueRequirement[];

  issueId: string;
  projectId: string;
  companyId: string;
  currentIssue: Issue;

  expectedTime: number;

  getAllRequirements(){
    this.issueId = this.route.snapshot.paramMap.get('issueId'); 
    this.listOfRequirements = [];
    this.subscribe(this.issueRequirementsService.getRequirements(this.issueId), 
      (data) => {
        this.listOfRequirements = data;

      },
      (error) => {
        // TODO Fehlerausgabe
        console.error(error);
      }
    );
    this.subscribe(this.issueService.getIssue(this.projectId, this.issueId),
      (data) => {
        this.currentIssue = data;

      },
      (error) => {
        // TODO Fehlerausgabe
        console.error(error);
      }
    );
  }

  removeRequirement(req: IssueRequirement){
    this.issueRequirementsService.deleteRequirement(this.route.snapshot.paramMap.get('issueId'), req.id).subscribe(
      (data)=>{
        this.router.navigateByUrl(`${this.companyId}/projects/${this.projectId}/issues/${this.issueId}`);
      },
      (error) =>{
        console.error(error);
      }
    );
  }

  issue: Issue;



  sendSummary(
  ): Observable<any> {
    this.issue = {
      
      "createdAt": this.currentIssue.createdAt,
      "state": {
        "id": this.projectId,
        "name": "",
        "phase": ""
      },
      "project": {
        "id": this.projectId,
        "name": ""
      },
      "client": {
        "id": this.projectId,
        "firstname": "",
        "lastname": ""
      },
      "author": {
        "id": this.projectId,
        "firstname": "",
        "lastname": ""
      },
      "issueDetail": {
        "name": this.currentIssue.issueDetail.name,
        "type": this.currentIssue.issueDetail.type,
        "startDate": this.currentIssue.issueDetail.startDate,
        "endDate": this.currentIssue.issueDetail.endDate,
        "expectedTime": this.expectedTime,
        "progress": this.currentIssue.issueDetail.progress,
        "description": this.currentIssue.issueDetail.description,
        "requirements": this.currentIssue.issueDetail.requirements,
        "requirementsAccepted": this.currentIssue.issueDetail.requirementsAccepted,
        "requirementsNeeded": this.currentIssue.issueDetail.requirementsNeeded,
        "priority": this.currentIssue.issueDetail.priority,
        "visibility": this.currentIssue.issueDetail.visibility
      }
    };
    this.issueService.updateIssue(this.projectId, this.issueId, this.issue).subscribe(
      (data)=>{
      },
      (error) =>{
        console.error(error);
      }
    );
    this.issueSummaryService.createSummary(this.issueId, this.listOfRequirements).subscribe(
      (data)=>{
        this.router.navigateByUrl(`${this.companyId}/projects/${this.projectId}/issues/${this.issueId}`);
      },
      (error) =>{
        console.error(error);
      }
    );
    return
  }

}
