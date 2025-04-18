import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";  // Import useNavigation

export default function CRUDScreen() {
  const [bookings, setBookings] = useState([]);
  const navigation = useNavigation();  // Get navigation object

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

  // Delete booking from Firestore
  const handleDeleteBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await deleteDoc(bookingRef);

      Alert.alert("Success", "Booking deleted successfully!");

      // Remove booking from the local state
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
        <Button
          title="Back"
          onPress={() => navigation.goBack()}  // Navigate back to ProfileScreen
        />
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
              <Button
                title="Delete"
                color="#d9534f"
                onPress={() => handleDeleteBooking(item.id)}
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
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  bookingItem: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  bookingText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,  // Ensure button stays on top of other elements
  },
});
