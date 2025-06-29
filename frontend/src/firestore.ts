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

export async function add_new_employee_test() {
  await addDoc(collection(db, "employees"), {
    name: "Jae Min",
    username: "jaemin7176",
    password: "abc123", // hash this in real app!
    pay_rate: 17.8,
    is_admin: false,
  });
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
