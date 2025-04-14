import React, { useState, useEffect } from "react";
import {View,Text,TextInput,Button,FlatList,StyleSheet,Alert,} from "react-native";
import {getAuth,createUserWithEmailAndPassword,deleteUser,updateEmail,reauthenticateWithCredential,EmailAuthProvider,} from "firebase/auth";
import { db } from "../firebase/firebase"; 
import { collection, addDoc, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";

const auth = getAuth(); 

export default function CRUDScreen() {
const [users, setUsers] = useState([]);
   const [newUserEmail, setNewUserEmail] = useState("");
const [newUserPassword, setNewUserPassword] = useState("");
   const [updateEmailInput, setUpdateEmailInput] = useState("");
   const [updateUsernameInput, setUpdateUsernameInput] = useState(""); 
   const [selectedUserId, setSelectedUserId] = useState(null);

 
useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, []);

  // Create new user in Firebase Auth and add to Firestore
  const handleCreateUser = async () => {
    if (newUserEmail.trim() === "" || newUserPassword.trim() === "") {
      Alert.alert("Error", "Please enter a valid email and password.");
      return;
    }

    try {
      // Create user with Firebase Authentication (without signing them in)
      await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
      
      // Add the user details to Firestore, including the password (for admin purposes)
      await addDoc(collection(db, "users"), {
        uid: auth.currentUser.uid, // Use the current logged-in user's UID for Firestore
        email: newUserEmail,
        password: newUserPassword, // Storing password (NOT recommended for production)
        username: "", // Initialize with an empty username
        createdAt: new Date(),
      });

      // Reset inputs after creation
      setNewUserEmail("");
      setNewUserPassword("");
      Alert.alert("Success", "User created successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Error creating user:", error);
    }
  };

  // Update user info (username, email)
  const handleUpdateUser = async () => {
    if (!selectedUserId || updateUsernameInput.trim() === "") {
      Alert.alert("Error", "Please select a user and provide a new username.");
      return;
    }
  
    try {
      const userRef = doc(db, "users", selectedUserId);
  
      // Update Firestore document with new username
      await updateDoc(userRef, {
        username: updateUsernameInput, // Update the username
      });
  
      // Ensure the current user's email update if changed
      const user = auth.currentUser;
  
      // Update email if it's different from the current one
      if (updateEmailInput.trim() && user.email !== updateEmailInput) {
        await updateEmail(user, updateEmailInput); // Update email in Firebase Authentication
      }
  
      // Clear input fields and reset selected user
      setUpdateEmailInput(user.email); // Keep the email intact
      setUpdateUsernameInput(""); // Clear the username input
      setSelectedUserId(null);
  
      Alert.alert("Success", "User updated successfully!");
  
      // Fetch the updated user list after modifying
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      });
  
      return unsubscribe;
  
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Error updating user:", error);
    }
  };

  // Delete user from Firebase Auth and Firestore
  const handleDeleteUser = async (userId) => {
    try {
      const firebaseUser = auth.currentUser;
  
      if (!firebaseUser) {
        Alert.alert("Error", "No user is currently logged in.");
        return;
      }
  
      // Prompt user for their password
      const password = prompt("Please enter your password to confirm deletion:");
      if (!password) {
        Alert.alert("Error", "Password is required to delete your account.");
        return;
      }
  
      // Get the user from Firestore by ID
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        Alert.alert("Error", "User not found.");
        return;
      }
  
      // Re-authenticate the current user before deletion
      const userCredential = EmailAuthProvider.credential(firebaseUser.email, password);
      await reauthenticateWithCredential(firebaseUser, userCredential);
      
      // Now delete the user from Firebase Authentication
      await deleteUser(firebaseUser);
  
      // Delete the user from Firestore
      await deleteDoc(userRef);
  
      Alert.alert("Success", "User deleted successfully!");
  
      // Remove the user from the list in the UI
      setUsers(users.filter((user) => user.id !== userId)); 
  
      // Stay on the CRUDScreen
      // Do not navigate away, so no need for a redirect to LoginScreen
  
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Error deleting user:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Authentication User Management</Text>

      {/* Create New User */}
      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter user email"
          value={newUserEmail}
          onChangeText={setNewUserEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter user password"
          value={newUserPassword}
          onChangeText={setNewUserPassword}
          secureTextEntry
        />
        <Button title="Create User" onPress={handleCreateUser} />
      </View>

      {/* Update User */}
      {selectedUserId && (
        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Email (Cannot be changed)"
            value={updateEmailInput}
            editable={false} // Make email input read-only
          />
          <TextInput
            style={styles.input}
            placeholder="Enter new username"
            value={updateUsernameInput}
            onChangeText={setUpdateUsernameInput}
          />
          <Button title="Update User" onPress={handleUpdateUser} />
        </View>
      )}

      {/* User List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.listHeader}>User List</Text>}
        renderItem={({ item }) => (
          <View
            style={[styles.userItem, selectedUserId === item.id && styles.selectedUserItem]}
          >
            <Text style={styles.userText}>Email: {item.email}</Text>
            <Text style={styles.userText}>Username: {item.username}</Text> {/* Display username */}
            <Text style={styles.userText}>Password: {item.password}</Text> {/* Display password from Firestore */}
            <View style={styles.buttonsContainer}>
              <Button
                title="Edit"
                onPress={() => {
                  setSelectedUserId(item.id);
                  setUpdateEmailInput(item.email); // Set the email as initial value
                  setUpdateUsernameInput(item.username); // Set the username as initial value
                }}
              />
              <Button
                title="Delete"
                color="#d9534f"
                onPress={() => handleDeleteUser(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formSection: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  userItem: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  selectedUserItem: {
    borderColor: "#6c63ff",
    borderWidth: 2,
  },
  userText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
