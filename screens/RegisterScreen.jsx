import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomCard from "../components/CustomCard";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();

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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Sign out immediately to prevent auto-login
        await signOut(auth);

        // Add user to Firestore
        await addDoc(collection(db, "users"), {
          id: user.uid,
          email: email,
          password: password, // ⚠️ For testing only
          role: "",
          createdAt: new Date(),
        });

        console.log("✅ User registered, signed out, and added to Firestore");

        // Navigate to Login screen
        navigation.navigate("Login");

      } catch (error) {
        setError(error.message);
        console.error("❌ Registration error:", error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Firebase App</Text>
        <CustomCard style={[styles.card, { width: width > 420 ? 400 : "90%" }]}>
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
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          <CustomButton title="Register" onPress={handleRegister} />
          <Pressable
            onPress={() => {
              console.log("🔁 Login link pressed");
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.linkText}>Already a member? Login here</Text>
          </Pressable>
        </CustomCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    alignItems: "center",
    padding: 16,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  linkText: {
    marginTop: 10,
    textAlign: "center",
  
  },
});