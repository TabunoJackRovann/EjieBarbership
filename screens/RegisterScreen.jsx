import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Image,
} from "react-native";
import CustomCard from "../components/CustomCard";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Logo from "../assets/Logo.png";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();

  const logoSize = width < 350 ? 100 : width < 420 ? 120 : 150;

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

      // ✅ Save user in Firestore with UID as document ID
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: email,
        password: password,
        createdAt: new Date(),
      });

      // ✅ Optional: sign out immediately
      await signOut(auth);

      console.log("✅ User registered, signed out, and added to Firestore");
      navigation.navigate("Login");
    } catch (error) {
      setError(error.message);
      console.error("❌ Registration error:", error);
    }
  }
};


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Top Nav Logo Row (Navbar) */}
      <View style={styles.navBar}>

        <Image source={require("../assets/Logo.png")} style={styles.navLogo} />

        <Text style={styles.navTitle}>THE EJIE BARBERSHOP</Text>
      </View>

      <View style={styles.container}>
        <CustomCard style={[styles.card, { width: width > 420 ? 400 : "90%" }]}>
          {/* Logo */}

          <Image
            source={Logo}
                      style={[styles.regLogo, { width: logoSize, height: logoSize }]}
                    />

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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.loginLink,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginLinkText}>Already a member? Login here</Text>
          </Pressable>
        </CustomCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "flex-start",
    backgroundColor: "#232423",
  },
  navLogo: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    fontFamily: "Kristi",  // Keeps Kristi font for the title
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 5 },
    textShadowRadius: 3,
    flexGrow: 2,
    marginBottom: 15  
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#232423",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  card: {
    alignItems: "center",
    padding: 16,
  },
  input: {
    width: "90%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 17,
    fontFamily: "Kristi",
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "gray",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  registerButton: {
    width: "30%",
    padding: 7,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 17,
    borderColor: "black",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'Kristi',
    color: "gray",
  },
  pressed: {
    opacity: 0.7,
  },
  loginLink: {
    marginTop: 12,
    padding: 8,
  },
  loginLinkText: {
    marginTop: 10,
    color: "rgba(0, 0, 0, 5)",
    fontFamily: "Kristi",
    fontWeight: "bold",
    textAlign: "center",
  },
  regLogo: {
    marginBottom: 15,
  },
});
