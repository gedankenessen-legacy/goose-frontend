import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueAssignedComponent } from './issue-assigned.component';

describe('IssueAssignedComponent', () => {
  let component: IssueAssignedComponent;
  let fixture: ComponentFixture<IssueAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssueAssignedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
