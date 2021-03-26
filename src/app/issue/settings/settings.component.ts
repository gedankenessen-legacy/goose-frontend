import { Component, OnInit } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { User } from 'src/app/interfaces/User';
import { Predecessor } from 'src/app/interfaces/issue/Predecessor';
import { IssueDocument } from 'src/app/interfaces/issue/Document';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
  listOfDocuments: IssueDocument[] = [];

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
        name: "Relevantes Dokument"
      }
    ];
    this.documentRows++;
  }

}

