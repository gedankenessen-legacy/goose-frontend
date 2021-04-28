import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { User } from 'src/app/interfaces/User';
import { Predecessor } from 'src/app/interfaces/issue/Predecessor';
import { IssueDocument } from 'src/app/interfaces/issue/Document';
import { State } from 'src/app/interfaces/project/State';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../issue.service';
import { IssueRelevantDocuments } from 'src/app/interfaces/issue/IssueRelevantDocuments';
import { IssueAssignedUsersService } from '../issue-assigned-users.service';
import { first } from 'rxjs/operators';
import { IssuePredecessorService } from '../issue-predecessors.service';
import { IssueDetailsService } from '../issue-details.service';
import { IssueAssignedUser } from '../../interfaces/issue/IssueAssignedUser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
  visibleInput: string;
  stateName: string;

  constructor(
    private router: Router,
    private issueService: IssueService,
    private issueDetailsService: IssueDetailsService,
    private issueAssignedUsersService: IssueAssignedUsersService,
    private issuePredecessorService: IssuePredecessorService,
    private route: ActivatedRoute
  ) {}

  companyId: string;
  projectId: string;
  issueId: string;
  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');

    if (this.issueId != null) {
      this.getIssue();
      this.getAssignedUsers();
      this.getAllPredecessors();
      this.getAllDocuments();
    }
  }

  issue: Issue = {
    createdAt: undefined,
    state: {
      id: '',
      name: '',
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

  getIssue() {
    this.issueDetailsService
      .getIssue(this.projectId, this.issueId)
      .subscribe((data) => {
        this.issue = data;

        console.log(data);
        if (this.issue.issueDetail.visibility) {
          this.visibleInput = 'extern';
        } else {
          this.visibleInput = 'intern';
        }

        /** DEBUG FOR NULL VALUE IN TICKET */
        /** BACKEND SET TICKET STATE, CLIENT, AUTHOR TO NULL - IN DEV */
        if (this.issue.state == null) {
          this.issue.state = {
            id: '',
            name: 'ueberpruefen',
            phase: '',
          };
        }

        if (this.issue.client == null) {
          this.issue.client = {
            id: '',
            firstname: '',
            lastname: '',
          };
        }

        if (this.issue.author == null) {
          this.issue.author = {
            id: '',
            firstname: '',
            lastname: '',
          };
        }
        /** END OF DEBUG */

        (error) => {
          console.error(error);
        };
      });
  }

  submitForm() {
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
      this.issueService.createIssue(this.projectId, this.issue).subscribe(
        (data) => {
          this.router.navigateByUrl(
            `${this.companyId}/projects/${this.projectId}/issues`
          );
        },
        (error) => {
          console.error(error);
        }
      );
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
