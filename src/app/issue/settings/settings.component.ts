import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { User } from 'src/app/interfaces/User';
import { Predecessor } from 'src/app/interfaces/issue/Predecessor';
import { IssueDocument } from 'src/app/interfaces/issue/Document';
import { State } from 'src/app/interfaces/project/State';

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

  constructor() { }

  ngOnInit(): void {
  }


  //ComID 605c95b3346214a9113c549c
  //P ID 605b80dee61730565bfe4b79

  submitForm() {
    let startState: State = {
      name: this.state,
      phase: ''
    }

    if(this.visibleInput === 'extern') {
      this.visible = true;
    } else {
      this.visible = false;
    }

    let issue: Issue = {
      id: '0',
      description: this.description,
      name: this.name,
      priority: this.priority,
      state: startState,
      type: this.type,
      visible: this.visible,
      startDate: this.startDate,
      endDate: this.endDate
    }



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

