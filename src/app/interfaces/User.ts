interface User {
  id: number;
  firstname: string;
  lastname: string;
  hashedPassword?: string;
}

export default User;
