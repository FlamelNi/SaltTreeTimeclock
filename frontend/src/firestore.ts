import { initializeApp } from "firebase/app";
import { Employee, WorkHour } from "./datatype";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  where,
  getDocs as getDocsQuery,
  DocumentData,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

// Update an employee's rate
export async function update_employee_rate(employee_id: string, new_rate: number): Promise<void> {
  const employeeRef = doc(collection(db, "employees"), employee_id);
  await updateDoc(employeeRef, { pay_rate: new_rate });
}

// Add a new work_hour entry
export async function add_new_work_hour(employee_id: string, time_in: Timestamp, time_out: Timestamp, pay_rate: number): Promise<void> {
  await addDoc(collection(db, "work_hours"), {
    employee_id,
    time_in,
    time_out,
    pay_rate,
  });
}

// Delete a work hour entry by ID
export async function delete_work_hour(work_hour_id: string): Promise<void> {
  // 'work_hours' is the collection name
  await deleteDoc(doc(db, "work_hours", work_hour_id));
}

const firebaseConfig = {
  apiKey: "AIzaSyBrBVP3ltNHcaU_hs0114heXjzXc-71ncE",
  authDomain: "salttreetimeclock.firebaseapp.com",
  projectId: "salttreetimeclock",
  storageBucket: "salttreetimeclock.firebasestorage.app",
  messagingSenderId: "471135136571",
  appId: "1:471135136571:web:3bcf515f79067786c9e51e",
  measurementId: "G-BP5VMJS4JR",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function get_all_employees(): Promise<Employee[]> {
  const snapshot = await getDocs(collection(db, "employees"));
  const employees = snapshot.docs.map((doc) => {
    const data = doc.data();
    return new Employee(doc.id, data.is_admin, data.name, data.password, data.pay_rate, data.username, false, Timestamp.now());
  });
  return employees;
}

// Add new employee with hashed password
export async function add_new_employee(name: string, username: string, password_hash: string, pay_rate: number, is_admin = false): Promise<void> {
  await addDoc(collection(db, "employees"), {
    name,
    username,
    password: password_hash,
    pay_rate,
    is_admin,
  });
}

// Update existing employee info (optionally new password hash)
export async function update_employee(
  employee_id: string,
  data: { name?: string; username?: string; password_hash?: string; pay_rate?: number; is_admin?: boolean }
): Promise<void> {
  const { password_hash, ...rest } = data;
  const update_data: any = { ...rest };
  if (password_hash) update_data.password = password_hash;
  const employeeRef = doc(collection(db, "employees"), employee_id);
  await updateDoc(employeeRef, update_data);
}

// Delete employee by ID (does NOT touch work_hours)
export async function delete_employee(employee_id: string): Promise<void> {
  await deleteDoc(doc(db, "employees", employee_id));
}

// Query work_hour table by employee and date range
export async function get_work_hours_for_employee_between(employee_id: string, starting: string, ending: string): Promise<WorkHour[]> {
  // Convert YYYY-MM-DD to proper Timestamps
  const startDateTime = new Date(starting + "T00:00:00");
  const endDateTime = new Date(ending + "T23:59:59");
  const startTimestamp = Timestamp.fromDate(startDateTime);
  const endTimestamp = Timestamp.fromDate(endDateTime);

  const workHourQuery = query(
    collection(db, "work_hours"),
    where("employee_id", "==", employee_id),
    where("time_in", ">=", startTimestamp),
    where("time_out", "<=", endTimestamp)
  );

  const querySnapshot = await getDocsQuery(workHourQuery);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as DocumentData;
    return new WorkHour(doc.id, data.time_in, data.time_out, data.pay_rate, data.employee_id);
  });
}
