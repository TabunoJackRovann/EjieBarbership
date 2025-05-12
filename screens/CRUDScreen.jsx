import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function CRUDScreen() {
  const [bookings, setBookings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const bookingsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsList);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await deleteDoc(bookingRef);

      Alert.alert("Success", "Booking deleted successfully!");

      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking Management</Text>

      {/* Back to Profile Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back to ProfileScreen
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Booking List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.listHeader}>Booking List</Text>}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.bookingText}>Barber: {item.barber}</Text>
            <Text style={styles.bookingText}>Created At: {item.createdAt.toDate().toLocaleString()}</Text>
            <Text style={styles.bookingText}>Date: {item.date}</Text>
            <Text style={styles.bookingText}>Email: {item.email}</Text>
            <Text style={styles.bookingText}>Name: {item.name}</Text>
            <Text style={styles.bookingText}>Phone: {item.phone}</Text>
            <Text style={styles.bookingText}>Time: {item.time}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteBooking(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
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
    backgroundColor: "#232423", // Dark background similar to ProfileScreen
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ffffff", // White text color to stand out on the dark background
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#ffffff", // White text for the list header
  },
  bookingItem: {
    padding: 15,
    backgroundColor: "#2f2f2f", // Slightly lighter dark background
    marginBottom: 10,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  bookingText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#fff", // White text for booking details
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
