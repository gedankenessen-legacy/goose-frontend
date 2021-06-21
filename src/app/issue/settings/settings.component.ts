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
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { error } from 'selenium-webdriver';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
  visibleInput: string = 'extern';
  newTicket: boolean = true;
  openSubTicket: boolean = false;
  timeappreciated: boolean = false;
  timeappreciatedMax: number = 1;
  visibiltyActive: boolean = true;
  companyId: string;
  projectId: string;
  issueId: string;
  createSub: string;
  loggedInUserRoles: Role[];
  maxPrio: number = 10;

  //Disable
  disableName: boolean = false;
  disableDescription: boolean = false;
  disablePriority: boolean = false;
  disableState: boolean = false;
  disableType: boolean = false;
  disableDateStart: boolean = false;
  disableDateEnd: boolean = false;
  disableVisibility: boolean = false;
  disableProgress: boolean = false;
  disablePredecessor: boolean = false;
  disableDocument: boolean = false;
  disableTimeAppreciated: boolean = false;
  disableSave: boolean = false;

  constructor(
    private router: Router,
    private issueService: IssueService,
    private issueAssignedUsersService: IssueAssignedUsersService,
    private issuePredecessorService: IssuePredecessorService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private modal: NzModalService,
    private stateService: StateService,
    private projectUserService: ProjectUserService,
    private authService: AuthService,
    private issueParentService: IssueParentService
  ) { }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    this.createSub = this.router.url.substr(this.router.url.length - 3);
    this.getAllStates();
    this.getAllIssues();
    this.checkIssueHasParent();

    //Load selected issue
    if (this.issueId != null) {
      this.newTicket = false;
      this.getIssue();
      this.getAssignedUsers();
      this.getAllDocuments();
      if (this.createSub === 'sub') {
        this.disableField(
          null,
          null,
          true,
          true,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );
        this.loadCustomer();
        this.setParentSettings();
      }
    } else {
      this.getUserRoles();
      this.disableField(
        null,
        null,
        null,
        true,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      );
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

    if (this.issue.issueDetail.type === 'bug') {
      this.issue.issueDetail.requirementsNeeded = false;
    }

    if (
      this.issue.state.name != null &&
      this.issue.issueDetail.name.length > 0 &&
      this.issue.state.name.length > 0 &&
      this.issue.issueDetail.type.length > 0 &&
      this.validDate()
    ) {
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
                let msg: string = error.Error.error.message;
                if (msg.includes('cannot update an issue state')) {
                  this.modal.error({
                    nzTitle: 'Fehler beim ändern des Tickets',
                    nzContent: 'Statusänderung nicht möglich',
                  });
                } else if (
                  msg.includes(
                    'At least one sub issue is not in conclusion phase'
                  )
                ) {
                  this.modal.error({
                    nzTitle: 'Fehler beim ändern des Tickets',
                    nzContent:
                      'Mindestens ein Unterticket ist noch nicht abgeschlossen',
                  });
                } else {
                  console.error(error);
                }
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
      this.listOfStates = data;
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
    let listOfProjectUsers: ProjectUser[];
    this.projectUserService
      .getProjectUsers(this.projectId)
      .subscribe((data) => {
        listOfProjectUsers = data;
        let companyCustomer: User = listOfProjectUsers.find((v) =>
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
    if (!this.newTicket && this.createSub != 'sub') {
      this.disableField(false, false, false, true, true, false, false, true, false, false, false, false, false);
    }

    if (!this.checkUserRole('Kunde')) {
      if (this.newTicket) {
        this.disableField(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          false,
          null,
          null,
          null,
          null,
          null
        );
      }
    } else {
      this.disableField(
        null,
        null,
        null,
        true,
        null,
        null,
        null,
        true,
        true,
        true,
        null,
        null,
        null
      );
    }

    if (this.checkUserRole('Mitarbeiter (Lesend)')) {
      this.disableField(
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
      );
    }

    if (
      !this.checkUserRole('Mitarbeiter (Lesend)') &&
      !this.checkUserRole('Kunde') &&
      !this.newTicket
    ) {
      if (this.createSub != 'sub' && !this.openSubTicket) {
        this.disableField(
          null,
          null,
          null,
          false,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );
      }
    }

    if (this.createSub != 'sub') {
      if (this.issue.state.name == 'Review') {
        if (
          !this.checkUserRole('Firma') &&
          !this.checkUserRole('Projektleiter')
        ) {
          this.disableField(
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
          );
        } else {
          this.disableField(
            true,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false
          );
        }
      }
    } else {
      this.disableField(
        false,
        false,
        true,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false
      );
    }

    if (this.issue.issueDetail.type == 'bug') {
      if (this.checkUserRole('Firma') || this.checkUserRole('Projektleiter')) {
        this.timeappreciated = true;
      }
    }

    if (this.createSub === 'sub') {
      if (this.checkUserRole('Firma') || this.checkUserRole('Projektleiter')) {
        this.listOfStates = this.listOfStates.filter(
          (n) => n.name != 'Verhandlung'
        );
      } else {
        this.listOfStates = this.listOfStates
          .filter((n) => n.name != 'Abgeschlossen')
          .filter((n) => n.name != 'Archiviert')
          .filter((n) => n.name != 'Verhandlung');
      }
    } else {
      if (this.checkUserRole('Firma') || this.checkUserRole('Projektleiter')) {
        this.listOfStates = this.listOfStates;
      } else {
        this.listOfStates = this.listOfStates
          .filter((n) => n.name != 'Abgeschlossen')
          .filter((n) => n.name != 'Archiviert');
      }
    }

    if (this.createSub != 'sub' && this.issue.state.phase == 'Abschlussphase') {
      this.disableField(true, true, true, true, true, true, true, true, true, true, true, true, true);
    }
  }

  /**
   *
   * Get possible predessors
   *
   */

  listOfProjectIssues: IssuePredecessor[] = [];
  listOfSelectedIds: String[] = [];
  listOfAlreadySet: String[] = [];

  //All Issues
  getAllIssues() {
    this.issueService.getIssues(this.projectId).subscribe((data) => {
      this.listOfProjectIssues = data
        .map((i) => ({ id: i.id, name: i.issueDetail.name }))
        .filter((i) => i.id != this.issueId);
      this.getAllSelectedIssues();
    });
  }

  //All Predecessor
  getAllSelectedIssues() {
    if (this.issueId != null && this.createSub != 'sub') {
      this.issuePredecessorService
        .getPredecessors(this.issueId)
        .subscribe((data) => {
          this.listOfSelectedIds = data.map((i) => i.id);
          this.listOfAlreadySet = data.map((i) => i.id);
        });
    }
  }

  updatePredecessor() {
    let newPredessors: String[] = [];
    newPredessors = this.listOfSelectedIds.filter(
      (item) => this.listOfAlreadySet.indexOf(item) < 0
    );
    let deletedPredessors: String[] = [];
    deletedPredessors = this.listOfAlreadySet.filter(
      (item) => this.listOfSelectedIds.indexOf(item) < 0
    );

    if (newPredessors.length > 0) {
      const calls = newPredessors.map(id => this.issuePredecessorService.createPredecessor(this.issueId, id.toString()).pipe(catchError(error => {
        this.modal.error({
          nzTitle: 'Vorgänger',
          nzContent: `${this.listOfProjectIssues.find((x) => x.id == id)?.name} konnte nicht hinzugefügt werden`,
        })
        this.getAllSelectedIssues()
        return of();
      })));

      calls.slice(1).reduce((acc, next, index) => acc.pipe(
        switchMap(() => next)), calls[0]).subscribe(data => this.getAllSelectedIssues());
    }

    if (deletedPredessors.length > 0) {
      const calls = deletedPredessors.map(id => this.issuePredecessorService.deletePredecessor(this.issueId, id.toString()).pipe(catchError(error => {
        this.modal.error({
          nzTitle: 'Vorgänger',
          nzContent: `${this.listOfProjectIssues.find((x) => x.id == id)?.name} konnte nicht gelöscht werden`,
        })
        return of();
      })));

      calls.slice(1).reduce((acc, next, index) => acc.pipe(
        switchMap(() => next)), calls[0]).subscribe(data => this.getAllSelectedIssues());
    }
  }

  /**
   *
   * Has issue parent
   *
   */
  checkIssueHasParent() {
    if (this.issueId != null) {
      this.issueParentService.getParent(this.issueId).subscribe((data) => {
        if (data.id != null) {
          this.disableField(
            null,
            null,
            true,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
          );
          this.getMaxTimeAppreciated();
        }
      });
    }
  }

  /**
   *
   * Has issue parent
   *
   */
  setParentSettings() {
    this.issueService
      .getIssue(this.projectId, this.issueId)
      .subscribe((data) => {
        this.issue.issueDetail.priority = data.issueDetail.priority;
        this.issue.issueDetail.visibility = data.issueDetail.visibility;
        if(this.issue.issueDetail.visibility == false) {
          this.visibleInput = 'intern';
        }
      });
  }

  /**
   *
   * Get max time appreciated
   *
   */
  getMaxTimeAppreciated() {
    this.issueParentService.getParent(this.issueId).subscribe((data) => {
      if (data.issueDetail.expectedTime <= 0) {
        this.timeappreciated = false;
      } else {
        this.timeappreciatedMax = data.issueDetail.expectedTime;
      }
    });
  }

  /**
   *
   * Disable fields
   *
   */

  disableField(
    disableName: boolean,
    disableDescription: boolean,
    disablePriority: boolean,
    disableState: boolean,
    disableType: boolean,
    disableDateStart: boolean,
    disableDateEnd: boolean,
    disableVisibility: boolean,
    disableProgress: boolean,
    disablePredecessor: boolean,
    disableDocument: boolean,
    disableTimeAppreciated: boolean,
    disableSave: boolean
  ) {
    if (disableName != null) {
      this.disableName = disableName;
    }

    if (disableDescription != null) {
      this.disableDescription = disableDescription;
    }

    if (disablePriority != null) {
      this.disablePriority = disablePriority;
    }

    if (disableState != null) {
      this.disableState = disableState;
    }

    if (disableType != null) {
      this.disableType = disableType;
    }

    if (disableDateStart != null) {
      this.disableDateStart = disableDateStart;
    }

    if (disableDateEnd != null) {
      this.disableDateEnd = disableDateEnd;
    }

    if (disableVisibility != null) {
      this.disableVisibility = disableVisibility;
    }

    if (disableProgress != null) {
      this.disableProgress = disableProgress;
    }

    if (disablePredecessor != null) {
      this.disablePredecessor = disablePredecessor;
    }

    if (disableDocument != null) {
      this.disableDocument = disableDocument;
    }

    if (disableTimeAppreciated != null) {
      this.disableTimeAppreciated = disableTimeAppreciated;
    }

    if (disableSave != null) {
      this.disableSave = disableSave;
    }
  }
}
