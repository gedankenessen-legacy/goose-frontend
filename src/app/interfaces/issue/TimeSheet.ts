import User from "../User";

interface TimeSheet {
  id: number;
  user: User;
  start: Date;
  end: Date
}

export default TimeSheet;
