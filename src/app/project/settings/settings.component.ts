import { Component, OnInit } from '@angular/core';
import User from "../../interfaces/User";
import State from "../../interfaces/project/State";
import { ProjectService } from "../project.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  constructor(private service: ProjectService) { }

  ngOnInit(): void {

  }

  // Sort functions
  sortColumnName = (a: User, b: User) => a.lastname.localeCompare(b.lastname);

  // Attributes
  QAButtonSize: 'default';
  projectName: string = "Hi";

  // customer
  selectedCustomer: any;
  userList: any;
  isLoading: true;

  // employees
  employeeList: any;
  radioValueUserRights: any;

  // States
  customStateIn: string;
  selectedPhase: string;
  customStates: State[];
  phaseList: string[] = ["Verhandlungsphase", "Bearbeitungsphase", "Abschlussphase"];

  deleteCustomState(id) {
    // Delete elem
    let pos = this.customStates.findIndex(state => state.id == id);
    this.customStates = this.customStates.slice(pos, 1);
  }

  addCustomState() {
    let elem: State = {
      name: this.customStateIn,
      phase: this.selectedPhase,
      userGenerated: true
    }

    // Post elem
    // Get elem
    // Add elem to list
  }

  sendForm() {

  }

  test() {

  }

  onSearch($event: string) {

  }
}
