import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { User } from 'src/app/interfaces/User';
import { Predecessor } from 'src/app/interfaces/issue/Predecessor';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../issue.service';
import { IssueRelevantDocuments } from 'src/app/interfaces/issue/IssueRelevantDocuments';
import { IssueAssignedUsersService } from '../issue-assigned-users.service';
import { IssuePredecessorService } from '../issue-predecessors.service';
import { IssueDetailsService } from '../issue-details.service';
import { IssueAssignedUser } from '../../interfaces/issue/IssueAssignedUser';
import { ProjectService } from 'src/app/project/project.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
  visibleInput: string = '';
  stateActive: boolean = true;
  companyId: string;
  projectId: string;
  issueId: string;

  constructor(
    private router: Router,
    private issueService: IssueService,
    private issueDetailsService: IssueDetailsService,
    private issueAssignedUsersService: IssueAssignedUsersService,
    private issuePredecessorService: IssuePredecessorService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');

    //Load selected issue
    if (this.issueId != null) {
      //Get issue details
      this.getIssue();
      //Get assigned users
      this.getAssignedUsers();
      //Get predecessors
      this.getAllPredecessors();
      //get documents
      this.getAllDocuments();
    }
  }

  //Basic issue model
  issue: Issue = {
    createdAt: undefined,
    state: {
      id: '',
      name: 'Überprüfung',
      phase: '',
      userGenerated: false,
    },
    issueDetail: {
      name: '',
      type: '',
      startDate: undefined,
      endDate: undefined,
      expectedTime: 0,
      progress: 0,
      description: '',
      requirementsAccepted: true,
      requirementsNeeded: true,
      requirements: [],
      priority: 0,
      visibility: true,
      relevantDocuments: [],
    },
  };

  //Load existing issue
  getIssue() {
    this.issueDetailsService
      .getIssue(this.projectId, this.issueId)
      .subscribe((data) => {
        this.issue = data;
        if (this.issue.issueDetail.visibility) {
          this.visibleInput = 'extern';
        } else {
          this.visibleInput = 'intern';
        }

        this.stateActive = false;

        (error) => {
          console.error(error);
        };
      });
  }

  //Save issue
  submitForm() {
    if (
      this.issue.issueDetail.name.length > 0 &&
      this.issue.state.name.length > 0 &&
      this.issue.issueDetail.type.length > 0 &&
      this.visibleInput.length > 0
    ) {
      //Set visibilty state
      if (this.visibleInput === 'extern') {
        this.issue.issueDetail.visibility = true;
      } else {
        this.issue.issueDetail.visibility = false;
      }

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
    let listOfDocuments: string[] = [];

    for (let entry of IssueRelevantDocuments) {
      listOfDocuments.push(entry.name);
    }

    return listOfDocuments;
  }

  //Helper method
  generateRelevantDocumentsArray(
    stringArray: string[]
  ): IssueRelevantDocuments[] {
    let listOfDocuments: IssueRelevantDocuments[] = [];
    for (let i = 0; i < listOfDocuments.length; i++) {
      this.listOfDocuments = [
        ...this.listOfDocuments,
        {
          name: stringArray[i],
        },
      ];
    }

    return listOfDocuments;
  }
}
