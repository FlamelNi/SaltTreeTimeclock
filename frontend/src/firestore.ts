import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { Employee } from "./datatype";

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
    return new Employee(doc.id, data.is_admin, data.name, data.password, data.pay_rate, data.username);
  });
  return employees;
}

// await addDoc(collection(db, "employees"), {
//   name: "Ryan Kong",
//   username: "ryank226",
//   password: "abc123", // hash this in real app!
//   pay_rate: 18.5,
//   is_admin: true,
// });
