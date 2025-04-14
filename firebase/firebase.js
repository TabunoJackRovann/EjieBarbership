import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAH3_0dVTzoUJ9r8pom5dqYbAVu1RfwDC0", 
  authDomain: "adv102-95cac.firebaseapp.com",
  projectId: "adv102-95cac",
  storageBucket: "adv102-95cac.appspot.com",
  messagingSenderId: "982385279742",
  appId: "1:982385279742:web:db74c036fc04fe9a369baf",
  measurementId: "G-N6EMGDMYP3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to add a new user to Firestore
export async function addUserToFirestore(name) {
  try {
    await addDoc(collection(db, "users"), {
      name: name,
      createdAt: new Date(),
    });
    console.log("User added to Firestore");
  } catch (error) {
    console.error("Error adding user: ", error);
  }
}

export { auth, db };
