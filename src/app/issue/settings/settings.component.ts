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

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {


  name: string;
  description: string;
  priority: number;
  type: string;
  state: string;
  visibleInput: string;
  visible: boolean;
  startDate: Date;
  endDate: Date;

  constructor(private router: Router, private issueService: IssueService, private issueDetailsService: IssueDetailsService, private issueAssignedUsersService: IssueAssignedUsersService, private issuePredecessorService: IssuePredecessorService, private route: ActivatedRoute) { }

  companyId: string;
  projectId: string;
  issueId: string;
  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.issueId = this.route.snapshot.paramMap.get('issueId');


    if(this.issueId != null) {
      this.getIssue();
      this.getAssignedUsers();
      this.getAllPredecessors();
      this.getAllDocuments();
    }
  }


  //ComID 605c95b3346214a9113c549c
  //P ID 605b80dee61730565bfe4b79

  getIssue() {
    this.issueDetailsService.getIssue(this.projectId, this.issueId).subscribe(
      (data)=>{
        this.name = data.name,
        this.description = data.description,
        this.priority = data.priority
        this.type = data.type
        this.visible = data.visibility
        if(this.visible) {
          this.visibleInput = 'extern';
        } else {
          this.visibleInput = 'intern';
        }
        this.startDate = data.startDate;
        this.endDate = data.endDate;
      },
      (error) =>{
        console.error(error);
      }
    );
  }

  submitForm() {
    if (this.visibleInput === 'extern') {
      this.visible = true;
    } else {
      this.visible = false;
    }

    let issue: any;
    issue = {
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
        "name": this.name,
        "type": this.type,
        "startDate": this.startDate,
        "endDate": this.endDate,
        "expectedTime": 0,
        "progress": 0,
        "description": this.description,
        "requirements": [],
        "requirementsAccepted": true,
        "requirementsNeeded": true,
        "priority": this.priority,
        "finalComment": "",
        "visibility": this.visible,
        "relevantDocuments": this.generateStringArray(this.listOfDocuments)
      }
    }

    this.issueService.createIssue(this.projectId, issue).subscribe(
      (data)=>{
        this.router.navigateByUrl(`${this.companyId}/projects/${this.projectId}/issues`);
      },
      (error) =>{
        console.error(error);
      }
    );
  }

  /**
   * 
   * Member
   * 
   */
  listOfMembers: User[] = [];

  getAssignedUsers(): void {
    this.issueAssignedUsersService.getAssignedUsers(this.issueId).subscribe(
      (data)=>{
        for(let entry of data) {
          let user: User = entry.user; 
          this.listOfMembers.push(user);
        }
      },
      (error) =>{
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
        name: ""
      }
    ];
    this.predecessorRows++;
  }

  getAllPredecessors() {
    this.issuePredecessorService.getPredecessors(this.issueId).subscribe(
      (data)=>{
        this.listOfPredecessors = data; 
      },
      (error) =>{
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
        name: ""
      }
    ];
    this.documentRows++;
  }

  getAllDocuments() {
    this.issueService.getIssue(this.projectId, this.issueId).subscribe(
      (data)=>{
        this.listOfDocuments = this.generateRelevantDocumentsArray(data.relevantDocuments);
      },
      (error) =>{
        console.error(error);
      }
    );
  }


  generateStringArray(IssueRelevantDocuments: IssueRelevantDocuments[]): string[] {
    let listOfDocuments: string[] = [];

    for(let entry of IssueRelevantDocuments) {
      listOfDocuments.push(entry.name);
    }

    return listOfDocuments;
  }

  generateRelevantDocumentsArray(stringArray: string[]): IssueRelevantDocuments[] {
    let listOfDocuments: IssueRelevantDocuments[] = [];

    for(let entry of stringArray) {
      this.listOfDocuments = [
        ...this.listOfDocuments,
        {
          name: entry
        }
      ];
    }

    return listOfDocuments;
  }
}

