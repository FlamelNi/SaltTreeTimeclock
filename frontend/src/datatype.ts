export class Employee {
  id: string;
  is_admin: boolean;
  name: string;
  password: string;
  pay_rate: number;
  username: string;

  constructor(id: string, is_admin: boolean, name: string, password: string, pay_rate: number, username: string) {
    this.id = id;
    this.is_admin = is_admin;
    this.name = name;
    this.password = password;
    this.pay_rate = pay_rate;
    this.username = username;
  }
}
