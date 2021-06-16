import { Component, OnInit, SimpleChange } from '@angular/core';
import { Issue } from 'src/app/interfaces/issue/Issue';
import { IssueService } from '../issue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableFilterList } from 'ng-zorro-antd/table';
import { ProjectUser } from 'src/app/interfaces/project/ProjectUser';
import { AuthService } from 'src/app/auth/auth.service';
import { SubscriptionWrapper } from 'src/app/SubscriptionWrapper';
import { ProjectService } from 'src/app/project/project.service';
import { ProjectUserService } from 'src/app/project/project-user.service';
import { StateService } from 'src/app/project/state.service';
import { TreeNodeInterface } from 'src/app/interfaces/issue/IssueTreeNode';
import { getSafePropertyAccessString } from '@angular/compiler';
import { IssueParentService } from '../issue-parent.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent extends SubscriptionWrapper implements OnInit {
  projectId: string;
  companyId: string;
  searchValue: string;
  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private stateService: StateService,
    private issueParentService: IssueParentService
  ) {
    super();
  }

  cardDesign: boolean;
  searchVisible: boolean = false;
  btnCardDesignTitle: string = 'Card Design';

  ngOnInit(): void {
    this.cardDesign = JSON.parse(localStorage.getItem('card_design')) ?? false;
    this.setBtnCardDesignTitle();
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.getAllIssues();
  }

  routeToIssue(issueId: string) {
    this.router
      .navigateByUrl(
        `${this.companyId}/projects/${this.projectId}/issues/${issueId}`
      )
      .then();
  }

  listOfIssues: Issue[];
  listOfIssuesCopy: Issue[];
  listOfMapData: TreeNodeInterface[] = [];
  listOfDisplayMapData: TreeNodeInterface[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  getAllIssues() {
    const companyId = this.route.snapshot.paramMap.get('projectId');
    this.listOfFilterPriorities = [];
    this.listOfFilterWorkers = [];
    this.listOfFilterStates = [];
    this.listOfIssues = [];
    this.listOfMapData = [];
    this.listOfDisplayMapData = [];
    this.mapOfExpandedData = {};
    this.subscribe(
      this.issueService.getIssues(this.projectId, {
        getChildren: true,
        getAll: true,
      }),
      (data) => {
        this.listOfIssues = data;
        this.listOfIssuesCopy = this.listOfIssues;
        this.listOfIssuesCopy.forEach((issue) => this.addToMapData(issue));
        this.search();
        this.listOfIssues.forEach((issue) =>
          this.listOfFilterWorkers.push({
            text: issue.author.firstname + ' ' + issue.author.lastname,
            value: issue.author.id,
          })
        );
        this.listOfIssues.forEach((issue) =>
          this.listOfFilterStates.push({
            text: issue.state?.name,
            value: issue.state?.id,
          })
        );
        this.listOfFilterWorkers = this.listOfFilterWorkers.filter(
          this.onlyUnique
        );
        this.listOfFilterStates = this.listOfFilterStates.filter(
          this.onlyUnique
        );
      }
    );

    this.subscribe(
      this.projectUserService.getProjectUsers(this.projectId),
      (data) => {
        this.listOfProjectUsers = data;
      }
    );
    /*this.subscribe(this.stateService.getStates(this.projectId), (data) =>
      data.forEach((data) =>
        this.listOfFilterStates.push({ text: data.name, value: data.name })
      )
    );*/
    //this.listOfFilterStates = this.listOfFilterStates.filter(this.onlyUnique);
    for (let i = 0; i < 11; i++) {
      this.listOfFilterPriorities.push({ text: i.toString(), value: i });
    }
  }
  addToMapData(issue: Issue) {
    let node: TreeNodeInterface;
    let length = this.listOfMapData.length + 1;
    node = {
      key: length.toString(),
      name: issue.issueDetail.name,
      issue: issue,
    };
    if (issue.parentIssue === null) {
      node.children = [];
      node.level = 0;
      this.mapOfExpandedData[node.key] = [];
      node = this.addAllChildren(node, issue, node, 0);
      this.listOfMapData.push(node);
      this.mapOfExpandedData[node.key].push({
        ...node,
        level: 0,
        expand: false,
        parent: null,
      });
      this.mapOfExpandedData[node.key].sort(this.sortMap);
    }
  }

  sortMap(a: TreeNodeInterface, b: TreeNodeInterface): number {
    let i = 0;
    while (true) {
      if (!a.key[i]) {
        return -1;
      }
      if (!b.key[i]) {
        return 1;
      }
      if (a.key[i] != b.key[i]) {
        return parseInt(a.key[i]) - parseInt(b.key[i]);
      }
      i++;
    }
  }

  addAllChildren(
    node: TreeNodeInterface,
    issue: Issue,
    topNode: TreeNodeInterface,
    level: number
  ): TreeNodeInterface {
    let children: Issue[];
    node.children = [];
    this.subscribe(this.issueParentService.getChildren(issue.id), (data) => {
      children = data;
      if (data === undefined) {
        return null;
      }
      if (data.length == 0) {
        return null;
      }
      data.forEach((child) => {
        let newChild: TreeNodeInterface;
        let length = node.children.length + 1;
        newChild = {
          key: node.key + length,
          name: child.issueDetail.name,
          issue: child,
        };
        newChild = this.addAllChildren(newChild, child, topNode, level + 1);
        node.children.push(newChild);
        this.mapOfExpandedData[topNode.key].push({
          ...newChild,
          level: level! + 1,
          expand: false,
          parent: node,
        });
        this.mapOfExpandedData[topNode.key].sort(this.sortMap);
        return node;
      });
    });
    return node;
  }

  pdf(): void {
    window.print();
  }

  toggleCardDesign(): void {
    this.cardDesign = !this.cardDesign;
    localStorage.setItem('card_design', JSON.stringify(this.cardDesign));
    this.setBtnCardDesignTitle();
  }

  setBtnCardDesignTitle(): void {
    this.btnCardDesignTitle = this.cardDesign ? 'Table Design' : 'Card Design';
  }

  toggleSearch(): void {
    this.searchVisible = !this.searchVisible;
    if (!this.searchVisible) this.searchValue = '';
  }

  listOfProjectUsers: ProjectUser[] = [];

  public cannotCreateIssue(): Boolean {
    let loggedInUser = this.authService.currentUserValue;
    let user = this.listOfProjectUsers.filter(
      (user) => user.user.id === loggedInUser.id
    )[0];
    return user?.roles.some((r) => r.name === 'Mitarbeiter (Lesend)'); // Exclude Users with Roles without write permission
  }

  sortColumnIssue(a: TreeNodeInterface, b: TreeNodeInterface): number {
    return a.issue.issueDetail.name.localeCompare(b.issue.issueDetail.name);
  }

  sortColumnProgress(a: TreeNodeInterface, b: TreeNodeInterface): number {
    return a.issue.issueDetail.progress - b.issue.issueDetail.progress;
  }

  sortColumnStart(a: TreeNodeInterface, b: TreeNodeInterface): number {
    return (
      new Date(a.issue.issueDetail.startDate).getTime() -
      new Date(b.issue.issueDetail.startDate).getTime()
    );
  }

  sortColumnDeadline(a: TreeNodeInterface, b: TreeNodeInterface): number {
    return (
      new Date(a.issue.issueDetail.endDate).getTime() -
      new Date(b.issue.issueDetail.endDate).getTime()
    );
  }

  sortColumnState(a: TreeNodeInterface, b: TreeNodeInterface): number {
    return a.issue.state.name.localeCompare(b.issue.state.name);
  }

  listOfFilterStates: NzTableFilterList;

  filterState(list: string[], item: TreeNodeInterface): Boolean {
    return list?.some((id) => id == item.issue.state.id);
  }

  listOfFilterPriorities: NzTableFilterList;

  filterPriority(list: number[], item: TreeNodeInterface): Boolean {
    return list?.some((name) => name == item.issue.issueDetail.priority);
  }

  listOfFilterWorkers: NzTableFilterList;

  filterWorker(list: string[], item: TreeNodeInterface): Boolean {
    return list?.some((element) => element == item.issue.author.id);
  }

  onlyUnique(value: { text; value }, index, self: NzTableFilterList) {
    let i = 0;
    let found = 0;
    self.forEach((element) => {
      if (element.value == value.value && found == 0) {
        found = i;
      }
      i++;
    });
    return found == index;
  }

  collapse(
    array: TreeNodeInterface[],
    data: TreeNodeInterface,
    $event: boolean,
    notTop?: Boolean
  ): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.key === d.key)!;
          target.expand = false;
          target.parent.expand = false;
          this.collapse(array, target, false, true);
        });
      } else {
        return;
      }
    } else {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.key === d.key)!;
          target.parent.expand = true;
        });
      }
      data.expand = true;
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }

    return array;
  }

  visitNode(
    node: TreeNodeInterface,
    hashMap: { [key: string]: boolean },
    array: TreeNodeInterface[]
  ): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  expandCheck(item: TreeNodeInterface): Boolean {
    if (item.parent?.expand) {
    }
    //return true;
    return (!!item.parent && item.parent.expand) || !item.parent;
  }

  search(): void {
    if (this.searchValue == 'TODO') {
      this.listOfDisplayMapData = this.listOfMapData.filter((node) => {
        if (
          node.issue.state.name == 'Blockiert' ||
          node.issue.state.name == 'Wartend' ||
          node.issue.state.phase == 'Abschlussphase'
        ) {
          return false;
        } else {
          return true;
        }
      });
      return;
    }
    this.listOfDisplayMapData = !this.searchValue
      ? this.listOfMapData
      : this.listOfMapData.filter((node) =>
          new RegExp(`(.*?)${this.searchValue}(.*?)`, 'i').test(
            node.issue.issueDetail.name
          )
        );
  }

  timerClicked(): void {
    console.log('Clicked');
    this.getAllIssues();
  }
}
