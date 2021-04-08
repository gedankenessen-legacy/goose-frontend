import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { User } from 'src/app/interfaces/User';
import { Predecessor } from 'src/app/interfaces/issue/Predecessor';
import { IssueDocument } from 'src/app/interfaces/issue/Document';
import { State } from 'src/app/interfaces/project/State';
import { Router } from '@angular/router';
import { IssueService } from '../issue.service';

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

  constructor(private router: Router, private issueService: IssueService) { }


  ngOnInit(): void {
  }


  //ComID 605c95b3346214a9113c549c
  //P ID 605b80dee61730565bfe4b79

  submitForm() {
    let startState: State = {
      name: this.state,
      phase: ''
    }

    if (this.visibleInput === 'extern') {
      this.visible = true;
    } else {
      this.visible = false;
    }

    let issue: any;
    issue = {
      "state": {
        "id": "605b80dee61730565bfe4b79",
        "name": "",
        "phase": ""
      },
      "project": {
        "id": "605b80dee61730565bfe4b79",
        "name": ""
      },
      "client": {
        "id": "605b80dee61730565bfe4b79",
        "firstname": "",
        "lastname": ""
      },
      "author": {
        "id": "605b80dee61730565bfe4b79",
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
        "finalComment": "string",
        "visibility": this.visible,
        "relevantDocuments": []
      }
    }

    this.issueService.createIssue("605b80dee61730565bfe4b79", issue).subscribe(
      (data)=>{
        console.log("ok: " + data);
      },
      (error) =>{
        console.error(error);
      }
    );


    console.log(issue);


  }

  /**
   * 
   * PLACEHOLDER MEMBER
   * 
   */
  memberRows = 0;
  memberEditId: string | null = null;
  listOfMembers: User[] = [];

  startMemberEdit(id: string): void {
    this.memberEditId = id;
  }

  stopMemberEdit(): void {
    this.memberEditId = null;
  }

  addMemberRow(): void {
    this.listOfMembers = [
      ...this.listOfMembers,
      {
        id: "" + this.memberRows,
        firstname: "Max",
        lastname: "Mustermann"
      }
    ];
    this.memberRows++;
  }

  /**
   * 
   * PLACEHOLDER PREDECESSOR
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
        name: "Vorgänger"
      }
    ];
    this.predecessorRows++;
  }

  /**
   * 
   * PLACEHOLDER DOCUMENT
   * 
   */
  documentRows = 0;
  documentEditId: string | null = null;
  listOfDocuments: string[] = [];

  startDocumentEdit(id: string): void {
    this.documentEditId = id;
  }

  stopDocumentEdit(): void {
    this.documentEditId = null;
  }

  addDocumentRow(): void {
    this.listOfDocuments.push("Relevenates Dokument");
    console.log(this.listOfDocuments);
    this.documentRows++;
  }

}

