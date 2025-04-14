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
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();

  const handleLogin = () => {
    console.log("Login button pressed");
    console.log("Email:", email);
    console.log("Password:", password);

    if (!email || !password) {
      alert("Please enter username and password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful! UID:", user.uid);
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setError(error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Firebase App ni Tabuno</Text>
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
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <CustomButton title="Login" onPress={handleLogin} />
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Not a member? Register here</Text>
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
