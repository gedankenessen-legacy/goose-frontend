import { Project } from "../project/Project";
import { State } from "../project/State";
import { User } from "../User";

export interface IssueDashboardContent{
    id: string;
    name: string;
    project?: Project;
    author?: string;
    progress: number; 
    state?: string;
    startDate: Date;
    endDate: Date;
    priority: number
}