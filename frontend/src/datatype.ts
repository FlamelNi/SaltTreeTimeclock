import { Timestamp } from "firebase/firestore";

export class Employee {
  id: string;
  is_admin: boolean;
  name: string;
  password: string;
  pay_rate: number;
  username: string;
  is_on_work: boolean;
  time_in: Timestamp;

  constructor(
    id: string,
    is_admin: boolean,
    name: string,
    password: string,
    pay_rate: number,
    username: string,
    is_on_work: boolean,
    time_in: Timestamp
  ) {
    this.id = id;
    this.is_admin = is_admin;
    this.name = name;
    this.password = password;
    this.pay_rate = pay_rate;
    this.username = username;
    this.is_on_work = is_on_work;
    this.time_in = time_in;
  }
}

export class WorkHour {
  id: string;
  time_in: Timestamp;
  time_out: Timestamp;
  pay_rate: number;
  employee_id: string;

  constructor(id: string, time_in: Timestamp, time_out: Timestamp, pay_rate: number, employee_id: string) {
    this.id = id;
    this.time_in = time_in;
    this.time_out = time_out;
    this.pay_rate = pay_rate;
    this.employee_id = employee_id;
  }
}
