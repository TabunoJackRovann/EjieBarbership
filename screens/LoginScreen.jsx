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
import Logo from "../assets/Logo.png"; // ✅ Correct image source import
import CustomCard from "../components/CustomCard";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();

  const logoSize = width < 350 ? 100 : width < 420 ? 120 : 150;

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter username and password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setError(error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Top Nav Logo Row */}
      <View style={styles.navBar}>
        <Image source={Logo} style={styles.navLogo} />
        <Text style={styles.navTitle}>THE EJIE BARBERSHOP</Text>
      </View>

      {/* Main Login Content */}
      <View style={styles.container}>
        <CustomCard style={[styles.card, { width: width > 420 ? 400 : "90%" }]}>
          <Image
            source={Logo}
            style={[styles.loginLogo, { width: logoSize, height: logoSize }]}
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Custom Pressable Button */}
          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Not a member? Register here</Text>
          </Pressable>
        </CustomCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Navbar
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

  // Main content
  container: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#232423",
  },
  loginLogo: {
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
    fontFamily: "Kristi",
  },
  linkText: {
    marginTop: 10,
    color: "rgba(0, 0, 0, 5)",
    fontFamily: "Kristi",
    fontWeight: "bold",
    textAlign: "center",
  },
  loginButton: {
    width: "30%",
    padding: 7,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 17,
    borderColor: "black",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Kristi",
    color: "gray",
  },
});
