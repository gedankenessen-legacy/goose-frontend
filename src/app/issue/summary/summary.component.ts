import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/base.service';
import { IssueRequirement } from 'src/app/interfaces/issue/IssueRequirement';
import { IssueRequirementsService } from '../issue-requirements.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less']
})
export class SummaryComponent implements OnInit {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor( private issueRequirementsService: IssueRequirementsService,
    private route: ActivatedRoute,
    private base: BaseService,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllRequirements();
  }

  listOfRequirements: IssueRequirement[];

  issueId: string;

  getAllRequirements(){
    this.issueId = this.route.snapshot.paramMap.get('issueId'); 
    this.issueRequirementsService.getRequirements(this.issueId).subscribe(
      (data) => {
        this.listOfRequirements = data;

      },
      (error) => {
        // TODO Fehlerausgabe
        console.error(error);
      }
    );
  }

  removeRequirement(req: IssueRequirement){
    this.issueRequirementsService.deleteRequirement(this.route.snapshot.paramMap.get('issueId'), req.id);
  }

  sendSummary(
  ): Observable<IssueRequirement> {
    return this.httpClient
      .post<IssueRequirement>(
        `${this.base.getUrl}/issues/${this.issueId}/`,
        this.listOfRequirements,
        this.httpOptions
      )
      .pipe(catchError(this.base.errorHandle));
  }

}
