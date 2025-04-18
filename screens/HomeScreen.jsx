import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("SelectBarber")}
      >
        <Text style={styles.buttonText}>Book here</Text>
      </Pressable>
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
  button: {
    backgroundColor: "#6A5ACD",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
