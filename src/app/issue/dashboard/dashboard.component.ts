import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
  projectId: string;
  companyId: string;
  searchValue: string;

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  cardDesign: boolean = true;
  searchVisible: boolean = false;
  btnCardDesignTitle: string = 'Card Design';

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.setBtnCardDesignTitle();
    this.getAllIssues();
  }

  routeToIssue(issueId: string) {
    this.router
      .navigateByUrl(
        `${this.companyId}/projects/${this.projectId}/issues/${issueId}`
      )
      .then();
  }

  listOfIssues: Issue[];

  getAllIssues() {
    const companyId = this.route.snapshot.paramMap.get('projectId');
    this.issueService.getIssues(companyId).subscribe(
      (data) => {
        this.listOfIssues = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  toggleCardDesign():void {
    this.cardDesign = !this.cardDesign;
  }
  
  setBtnCardDesignTitle():void{
    this.btnCardDesignTitle = this.cardDesign?'Table Design':'Card Design';

  }

  toggleSearch():void {
    this.searchVisible = !this.searchVisible;
    if(!this.searchVisible)this.searchValue=""
  }
}
