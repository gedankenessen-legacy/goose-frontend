import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { User } from 'src/app/interfaces/User';
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
import { CompanyUserService } from '../../company/company-user.service';
import { CompanyUser } from '../../interfaces/company/CompanyUser';
import { Role } from 'src/app/interfaces/Role';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { IssueParentService } from '../issue-parent.service';
import { IssueChildrenService } from '../issue-children.service';
import { IssuePredecessor } from 'src/app/interfaces/issue/IssuePredecessor';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
  visibleInput: string = 'extern';
  stateActive: boolean = true;
  newTicket: boolean = true;
  hasParent: boolean = false;
  openSubTicket: boolean = false;
  timeappreciated: boolean = false;
  visibiltyInputActive: boolean = true;
  visibiltyActive: boolean = true;
  companyId: string;
  projectId: string;
  issueId: string;
  createSub: string;
  loggedInUserRoles: Role[];
  maxPrio: number = 10;

  constructor(
    private router: Router,
    private issueService: IssueService,
    private issueAssignedUsersService: IssueAssignedUsersService,
    private issuePredecessorService: IssuePredecessorService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private modal: NzModalService,
    private stateService: StateService,
    private companyUserService: CompanyUserService,
    private projectUserService: ProjectUserService,
    private authService: AuthService,
    private issueParentService: IssueParentService,
    private issueChildrenService: IssueChildrenService
  ) { }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    this.createSub = this.router.url.substr(this.router.url.length - 3);
    this.getAllStates();
    this.getAllIssues();

    //Load selected issue
    if (this.issueId != null) {
      this.newTicket = false;
      this.getIssue();
      this.getAssignedUsers();
      this.getAllDocuments();
      if (this.createSub === 'sub') {
        this.stateActive = true;
        this.loadCustomer();
      }
    } else {
      this.getUserRoles();
      this.stateActive = true;
      this.loadCustomer();
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
      priority: 1,
      visibility: true,
      relevantDocuments: [],
    },
  };

  //Load existing issue
  getIssue() {
    this.issueService
      .getIssue(this.projectId, this.issueId)
      .subscribe((data) => {
        if (this.createSub != 'sub') {
          this.issue = data;
          this.getParentPrio();
          this.allChildsDone();
        } else {
          this.maxPrio = data.issueDetail.priority;
        }
        this.issue.state = this.listOfStates.find(
          (v) => v.id === this.issue.state.id
        );
        this.getUserRoles();
        if (data.issueDetail.startDate != null) {
          if (new Date() < new Date(data.issueDetail.startDate)) {
            this.listOfStates = this.listOfStates
              .filter((n) => n.name != 'Wartend')
              .filter((n) => n.name != 'Review');
          }
        }
      });
  }

  //Save issue
  submitForm() {
    if (this.visibleInput === 'intern') {
      this.issue.issueDetail.visibility = false;
    }

    if (
      this.issue.issueDetail.name.length > 0 &&
      this.issue.state.name.length > 0 &&
      this.issue.issueDetail.type.length > 0 &&
      this.validDate()
    ) {
      this.updatePredessors();
      //Set relevant documents
      this.issue.issueDetail.relevantDocuments = this.generateStringArray(
        this.listOfDocuments
      );

      //Update issue
      if (this.issueId != null) {
        if (this.createSub === 'sub') {
          this.projectService
            .getProject(this.companyId, this.projectId)
            .subscribe(
              (dataProject) => {
                //Set Author
                this.issue.author = {
                  id: JSON.parse(localStorage.getItem('token')).id,
                  firstname: JSON.parse(localStorage.getItem('token'))
                    .firstname,
                  lastname: JSON.parse(localStorage.getItem('token')).lastname,
                };

                //Set Project
                this.issue.project = {
                  name: dataProject.name,
                  id: this.projectId,
                };

                this.issueService
                  .createIssue(this.projectId, this.issue)
                  .subscribe((data) => {
                    let childID = data.id;
                    this.issueParentService
                      .setParent(childID, this.issueId)
                      .subscribe((data) => {
                        this.router.navigateByUrl(
                          `${this.companyId}/projects/${this.projectId}/issues`
                        );
                      });
                  });
              },
              (error) => {
                console.error(error);
              }
            );
        } else {
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
        }
        //Create new issue
      } else {
        this.projectService
          .getProject(this.companyId, this.projectId)
          .subscribe(
            (dataProject) => {
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
      if (this.validDate()) {
        this.modal.error({
          nzTitle: 'Fehler beim speichern des Tickets',
          nzContent: 'Bitte füllen Sie alle Pflichtfelder aus',
        });
      } else {
        this.modal.error({
          nzTitle: 'Fehler',
          nzContent: 'Die Deadline darf nicht vor dem Start-Datum sein',
        });
      }
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
    this.listOfDocuments = this.listOfDocuments.filter(
      (v) => v.name.length > 0
    );
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
        this.generateRelevantDocumentsArray(documents);
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
    IssueRelevantDocuments = IssueRelevantDocuments.filter(
      (v) => v.name.length > 0
    );
    return IssueRelevantDocuments.map((i) => i.name);
  }

  //Helper method
  generateRelevantDocumentsArray(stringArray: string[]) {
    for (let i = 0; i < stringArray.length; i++) {
      this.listOfDocuments = [
        ...this.listOfDocuments,
        {
          name: stringArray[i],
        },
      ];
      this.documentRows++;
    }
  }

  /**
   *
   * STATE
   *
   */

  listOfStates: State[] = [];
  getAllStates() {
    this.stateService.getStates(this.projectId).subscribe((data) => {
      if (this.createSub === 'sub') {
        if (
          this.checkUserRole('Firma') ||
          this.checkUserRole('Projektleiter')
        ) {
          this.listOfStates = data.filter((n) => n.name != 'Verhandlung');
        } else {
          this.listOfStates = data
            .filter((n) => n.name != 'Abgeschlossen')
            .filter((n) => n.name != 'Archiviert')
            .filter((n) => n.name != 'Verhandlung');
        }
      } else {
        if (
          this.checkUserRole('Firma') ||
          this.checkUserRole('Projektleiter')
        ) {
          this.listOfStates = data;
        } else {
          this.listOfStates = data
            .filter((n) => n.name != 'Abgeschlossen')
            .filter((n) => n.name != 'Archiviert');
        }
      }
    });
  }

  changeTyp(state: string) {
    if (this.issueId == null || this.createSub === 'sub') {
      if (state == 'bug') {
        this.issue.state = this.listOfStates.find(
          (e) => e.name === 'Bearbeiten'
        );
      } else {
        this.issue.state = this.listOfStates.find(
          (e) => e.name === 'Überprüfung'
        );
      }
    }
  }

  /**
   *
   * Customer
   *
   */
  loadCustomer() {
    let listOfCompanyUsers: CompanyUser[];
    this.companyUserService
      .getCompanyUsers(this.companyId)
      .subscribe((data) => {
        listOfCompanyUsers = data;
        let companyCustomer: User = listOfCompanyUsers.find((v) =>
          v.roles.some((s) => s.name === 'Kunde')
        ).user;
        this.issue.client = companyCustomer;
      });
  }

  /**
   *
   * Date
   *
   */
  validDate(): boolean {
    if (
      this.issue.issueDetail.startDate != undefined &&
      this.issue.issueDetail.endDate != undefined
    ) {
      return !(
        this.issue.issueDetail.startDate >= this.issue.issueDetail.endDate
      );
    } else {
      return true;
    }
  }

  /**
   *
   * Role check
   *
   */
  getUserRoles() {
    this.projectUserService
      .getProjectUsers(this.projectId)
      .subscribe((data) => {
        this.loggedInUserRoles = data.find(
          (v) => v.user.id === this.authService.currentUserValue.id
        )?.roles;
        this.updateForm();
      });
  }

  checkUserRole(role: string): boolean {
    return this.loggedInUserRoles?.some((r) => r.name === role);
  }

  updateForm() {
    if (!this.checkUserRole('Kunde')) {
      this.visibiltyInputActive = false;
    }

    if (
      !this.checkUserRole('Mitarbeiter (Lesend)') &&
      !this.checkUserRole('Kunde') &&
      !this.newTicket
    ) {
      if (this.createSub != 'sub' && !this.openSubTicket) {
        this.stateActive = false;
      }
    }

    if (this.createSub != 'sub') {
      if (this.issue.state.name == 'Review') {
        if (
          !this.checkUserRole('Firma') &&
          !this.checkUserRole('Projektleiter')
        ) {
          this.stateActive = true;
        }
      }
    }

    if (this.issue.issueDetail.type == 'bug') {
      if (this.checkUserRole('Firma') || this.checkUserRole('Projektleiter')) {
        this.timeappreciated = true;
      }
    }
  }

  /**
   *
   * Get Parent Prio
   *
   */
  getParentPrio() {
    this.issueParentService.getParent(this.issueId).subscribe((data) => {
      if (data.id != null) {
        this.listOfStates = this.listOfStates
          .filter((n) => n.name != 'Review')
          .filter((n) => n.name != 'Verhandlung')
          .filter((n) => n.name != 'Abgeschlossen');
        if (data.issueDetail.priority > 0 && data.issueDetail.priority < 11) {
          this.maxPrio = data.issueDetail.priority;
        } else {
          this.maxPrio = 10;
        }
      } else {
        this.maxPrio = 10;
      }
    });
  }

  /**
   *
   * Get Child State
   *
   */
  allChildsDone() {
    this.openSubTicket = true;
    this.issueChildrenService.getChildren(this.issueId).subscribe((data) => {
      if (data.length > 0) {
        for (let i in data) {
          if (
            data[i].state.name != 'Abgeschlossen' ||
            data[i].state.name != 'Abgebrochen'
          ) {
            this.openSubTicket = true;
          }
        }
      } else {
        this.openSubTicket = false;
        this.stateActive = false;
      }
      if (this.openSubTicket) {
        this.stateActive = true;
        this.issue.state = this.listOfStates.find(
          (r) => r.name === 'Blockiert'
        );
      } else {
        this.openSubTicket = false;
        this.stateActive = false;
      }
    });
  }

  /**
   *
   * Get possible predessors 
   *
   */
  //All Issues
  listOfProjectIssues: IssuePredecessor[] = [];
  getAllIssues() {
    this.issueService.getIssues(this.projectId).subscribe((data) => {
      this.listOfProjectIssues = data
        .map(i => ({ id: i.id, name: i.issueDetail.name }))
        .filter((i) => i.id != this.issueId);
      if (this.createSub != 'sub') {
        this.getAllPredessors();
      }
    });
  }

  //Copy 
  listOfPredessors: IssuePredecessor[] = [];
  //Selected
  listOfCurrentPredessors: IssuePredecessor[] = [];
  getAllPredessors() {
    if (this.issueId != null) {
      this.issuePredecessorService.getPredecessors(this.issueId).subscribe((data) => {

        this.listOfCurrentPredessors = data.map(i => ({ id: i.id, name: i.issueDetail.name }));
        console.log(this.listOfCurrentPredessors);

        this.listOfPredessors = data.map(i => ({ id: i.id, name: i.issueDetail.name }));
      });
    }
  }

  updatePredessors() {
    let newPredessors: IssuePredecessor[] = [];
    //newPredessors = this.listOfCurrentPredessors.filter(item => this.listOfPredessors.indexOf(item) < 0);
    let deletedPredessors: IssuePredecessor[] = [];
    //deletedPredessors = this.listOfPredessors.filter(item => this.listOfCurrentPredessors.indexOf(item) < 0);

    console.log("listOfProjectIssues");
    console.log(this.listOfProjectIssues);
    console.log("listOfCurrentPredessors");
    console.log(this.listOfCurrentPredessors);
    console.log("listOfPredessors");
    console.log(this.listOfPredessors);
    console.log("newPredessors");
    console.log(newPredessors);
    console.log("deletedPredessors");
    console.log(deletedPredessors);

    //Create new predessor
    for (let i in newPredessors) {
      this.issuePredecessorService.createPredecessor(this.issueId, newPredessors[i].id).subscribe((data) => { },
        (error) => {
          let errorMSG = newPredessors[i].name + " ist nicht als Vörgänger möglich";
          this.modal.error({
            nzTitle: 'Vorgänger',
            nzContent: errorMSG,
          });
        });
    }

    //Delete predessor
    for (let i in deletedPredessors) {
      this.issuePredecessorService.deletePredecessor(this.issueId, deletedPredessors[i].id).subscribe((data) => { },
        (error) => {
          let errorMSG = "Löschen von " + deletedPredessors[i].name + " ist nicht möglich";
          this.modal.error({
            nzTitle: 'Vorgänger',
            nzContent: errorMSG,
          });
        });
    }
  }

}
