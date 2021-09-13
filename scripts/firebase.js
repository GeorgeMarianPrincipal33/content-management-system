import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA81E4McyCmkUZ-2TvW2_dJQIqSCOVv5Wc",
  authDomain: "content-managment-system.firebaseapp.com",
  projectId: "content-managment-system",
  storageBucket: "content-managment-system.appspot.com",
  messagingSenderId: "573005273475",
  appId: "1:573005273475:web:ad618d314c24ee784dfeb6",
  measurementId: "G-MWLJ0M568K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const COLLECTION_NAME = 'employees'

export async function getEmployees() {
    const employeesCol = collection(db, COLLECTION_NAME);
    const employeesSnapshot = await getDocs(employeesCol);
    const employeesList = employeesSnapshot.docs.map(doc => {
        var obj = doc.data()
        obj['id'] = doc.id
        
        return obj
    });

    return employeesList;
}

export async function addElementToFirebase(element) {
    const employeesCol = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(employeesCol, element)

    return docRef.id
}

export async function removeFromFirebase(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
}