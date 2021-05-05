import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { User } from 'src/app/interfaces/User';
import { Predecessor } from 'src/app/interfaces/issue/Predecessor';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../issue.service';
import { IssueRelevantDocuments } from 'src/app/interfaces/issue/IssueRelevantDocuments';
import { IssueAssignedUsersService } from '../issue-assigned-users.service';
import { IssuePredecessorService } from '../issue-predecessors.service';
import { IssueAssignedUser } from '../../interfaces/issue/IssueAssignedUser';
import { ProjectService } from 'src/app/project/project.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StateService } from 'src/app/project/state.service';
import { State } from 'src/app/interfaces/project/State';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
  visibleInput: string = 'extern';
  stateActive: boolean = true;
  companyId: string;
  projectId: string;
  issueId: string;

  constructor(
    private router: Router,
    private issueService: IssueService,
    private issueAssignedUsersService: IssueAssignedUsersService,
    private issuePredecessorService: IssuePredecessorService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private modal: NzModalService,
    private stateService: StateService
  ) { }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    
    this.getAllStates();

    //Load selected issue
    if (this.issueId != null) {
      this.getIssue();
      this.getAssignedUsers();
      this.getAllPredecessors();
      this.getAllDocuments();
    }
  }

  //Basic issue model
  issue: Issue = {
    createdAt: undefined,
    state: {
      id: undefined,
      name: undefined,
      phase: undefined,
      userGenerated: undefined,
    },
    issueDetail: {
      name: '',
      type: '',
      startDate: undefined,
      endDate: undefined,
      expectedTime: 0,
      progress: 0,
      description: '',
      requirementsAccepted: false,
      requirementsNeeded: true,
      requirements: [],
      priority: 0,
      visibility: true,
      relevantDocuments: [],
    },
  };

  //Load existing issue
  getIssue() {
    this.issueService
      .getIssue(this.projectId, this.issueId)
      .subscribe((data) => {
        this.issue = data;
        this.stateActive = false;
      });
  }

  //Save issue
  submitForm() {
    if(this.visibleInput === "intern") {
      this.issue.issueDetail.visibility = false;
    }

    console.log(this.issue);
    if (
      this.issue.issueDetail.name.length > 0 &&
      this.issue.state.name.length > 0 &&
      this.issue.issueDetail.type.length > 0
    ) {
      //Set relevant documents
      this.issue.issueDetail.relevantDocuments = this.generateStringArray(
        this.listOfDocuments
      );

      //Update issue
      if (this.issueId != null) {
        this.issueService
          .updateIssue(this.projectId, this.issueId, this.issue)
          .subscribe(
            (data) => {
              this.router.navigateByUrl(
                `${this.companyId}/projects/${this.projectId}/issues`
              );
            },
            (error) => {
              console.error(error);
            }
          );

        //Create new issue
      } else {
        this.projectService
          .getProject(this.companyId, this.projectId)
          .subscribe(
            (dataProject) => {
              //Set Client
              this.issue.client = {
                id: JSON.parse(localStorage.getItem('token')).id,
                firstname: JSON.parse(localStorage.getItem('token')).firstname,
                lastname: JSON.parse(localStorage.getItem('token')).lastname,
              };

              //Set Author
              this.issue.author = {
                id: JSON.parse(localStorage.getItem('token')).id,
                firstname: JSON.parse(localStorage.getItem('token')).firstname,
                lastname: JSON.parse(localStorage.getItem('token')).lastname,
              };

              //Set Project
              this.issue.project = {
                name: dataProject.name,
                id: this.projectId,
              };

              //Create new issue
              this.issueService
                .createIssue(this.projectId, this.issue)
                .subscribe(
                  (data) => {
                    this.router.navigateByUrl(
                      `${this.companyId}/projects/${this.projectId}/issues`
                    );
                  },
                  (error) => {
                    console.error(error);
                  }
                );
            },
            (error) => {
              console.error(error);
            }
          );
      }
    } else {
      this.modal.error({
        nzTitle: 'Fehler beim speichern des Tickets',
        nzContent: 'Bitte füllen Sie alle Pflichtfelder aus',
      });
    }
  }

  /**
   *
   * Member
   *
   */
  listOfAssignedUsers: IssueAssignedUser[];

  //Load all assigned Users
  getAssignedUsers(): void {
    this.issueAssignedUsersService.getAssignedUsers(this.issueId).subscribe(
      (data) => {
        this.listOfAssignedUsers = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   *
   * PREDECESSOR
   *
   */
  predecessorRows = 0;
  predecessorEditId: string | null = null;
  listOfPredecessors: Predecessor[] = [];

  startPredecessorEdit(id: string): void {
    this.predecessorEditId = id;
  }

  stopPredecessorEdit(): void {
    this.predecessorEditId = null;
  }

  addPredecessorRow(): void {
    this.listOfPredecessors = [
      ...this.listOfPredecessors,
      {
        name: '',
      },
    ];
    this.predecessorRows++;
  }

  //Load all predecessors
  getAllPredecessors() {
    this.issuePredecessorService.getPredecessors(this.issueId).subscribe(
      (data) => {
        this.listOfPredecessors = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   *
   * DOCUMENT
   *
   */
  documentRows = 0;
  documentEditId: string | null = null;
  listOfDocuments: IssueRelevantDocuments[] = [];

  startDocumentEdit(id: string): void {
    this.documentEditId = id;
  }

  stopDocumentEdit(): void {
    this.documentEditId = null;
  }

  addDocumentRow(): void {
    this.listOfDocuments = [
      ...this.listOfDocuments,
      {
        name: '',
      },
    ];
    this.documentRows++;
  }

  //Load all Documents
  getAllDocuments() {
    this.issueService.getIssue(this.projectId, this.issueId).subscribe(
      (data) => {
        let documents: string[] = data.issueDetail.relevantDocuments;
        this.listOfDocuments = this.generateRelevantDocumentsArray(documents);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //Helper method
  generateStringArray(
    IssueRelevantDocuments: IssueRelevantDocuments[]
  ): string[] {
    return IssueRelevantDocuments.map((i) => i.name);
  }

  //Helper method
  generateRelevantDocumentsArray(
    stringArray: string[]
  ): IssueRelevantDocuments[] {
    let listOfDocuments: IssueRelevantDocuments[] = [];
    for (let i = 0; i < listOfDocuments.length; i++) {
      this.listOfDocuments.push({ name: stringArray[i] });
    }
    return listOfDocuments;
  }

  /**
   *
   * STATE
   *
   */

  listOfStates: State[] = [];
  getAllStates() {
    this.stateService.getStates(this.projectId).subscribe(
      (data) => {
        this.listOfStates = data;
      });
  }

  changeTyp() {
    if(this.issue.issueDetail.type == "bug") {
      this.issue.state = this.listOfStates.find(e => e.name === 'Bearbeiten');
    } else {
      this.issue.state = this.listOfStates.find(e => e.name === 'Überprüfung');
    }
  }
}
