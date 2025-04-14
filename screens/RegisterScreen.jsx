import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomCard from "../components/CustomCard";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please enter username and password");
      return;
    } else if (password.length < 6 || confirmPassword.length < 6) {
      setError("Password must be at least 6 characters");
    } else if (confirmPassword !== password) {
      setError("Passwords do not match");
    } else {
      try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Add user to Firestore, including password and role (initially empty string)
        await addDoc(collection(db, "users"), {
          id: user.uid,
          email: email,
          password: password, // Storing password (NOT recommended for production)
          role: "", // Adding an empty role to be edited later
          createdAt: new Date(),
        });
  
        console.log("✅ User registered and added to Firestore");
        
        // Replace current screen with Login screen
        navigation.replace("Login");
      } catch (error) {
        setError(error.message);
        console.error("❌ Registration error:", error);
      }
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase App</Text>
      <CustomCard>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        ) : null}
        <CustomButton title="Register" onPress={handleRegister} />
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text>Already a member? Login here</Text>
        </Pressable>
      </CustomCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    width: 400,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#00a2ff",
    padding: 10,
    borderRadius: 5,
    cursor: "pointer",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
