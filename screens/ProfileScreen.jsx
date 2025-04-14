import { StyleSheet, View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function ProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;

  const handleLogout = async () => {
    setIsLoading(true); // Start loading

    try {
      await signOut(auth); // Actual logout action
      setTimeout(() => {
        setIsLoading(false); // Stop loading after the delay
        navigation.navigate("Login"); // Navigate to the login screen after delay
      }, 3000); // 3 seconds delay (adjust as needed)
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false); // Stop loading in case of error
    }
  };

  const handleManageUsers = () => {
    // No authorization check, directly navigate to CRUD screen
    navigation.navigate("CRUD");
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#6A5ACD" /> // Show loading spinner for 3 seconds
      ) : (
        <>
          {user ? (
            <>
              <Text style={styles.text}>Username: {user.email}</Text>
              <Text style={styles.text}>
                Account Created: {new Date(user.metadata.creationTime).toLocaleDateString()}
              </Text>

              {/* Logout Button */}
              <Pressable style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>

              {/* Manage Users Button (CRUD) */}
              <Pressable
                style={[styles.button, styles.crudButton]} // Add styling for the new button
                onPress={handleManageUsers} // Call handleManageUsers instead
              >
                <Text style={styles.buttonText}>Manage Users (CRUD)</Text>
              </Pressable>
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
    backgroundColor: "#6A5ACD", // Add a different color for CRUD button
  },
});
