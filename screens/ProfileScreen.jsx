import { StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function ProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [unauthorizedAttempts, setUnauthorizedAttempts] = useState(0); // NEW state

  const user = auth.currentUser;

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate("Login");
      }, 3000);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  const handleManageUsers = () => {
    if (user.email === "prefinal@gmail.com") {
      setError(""); // Clear error if previously triggered
      setUnauthorizedAttempts(0); // Reset attempts
      navigation.navigate("CRUD");
    } else {
      const newAttempts = unauthorizedAttempts + 1;
      setUnauthorizedAttempts(newAttempts);

      // Show error only on odd-numbered attempts
      if (newAttempts % 2 !== 0) {
        setError("ERROR: you have no authority to access this page!");
      } else {
        setError("");
      }
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#6A5ACD" />
      ) : (
        <>
          {user ? (
            <>
              <Text style={styles.text}>Username: {user.email}</Text>
              <Text style={styles.text}>
                Account Created: {new Date(user.metadata.creationTime).toLocaleDateString()}
              </Text>

              <Pressable style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.crudButton]} onPress={handleManageUsers}>
                <Text style={styles.buttonText}>Admin Access</Text>
              </Pressable>

              {error !== "" && (
                <Text style={styles.errorText}>{error}</Text>
              )}
            </>
          ) : (
            <Text style={styles.text}>No user logged in</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  crudButton: {
    backgroundColor: "#6A5ACD",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
