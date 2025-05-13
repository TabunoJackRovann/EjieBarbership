import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function CRUDScreen() {
  const [bookings, setBookings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'delete' or 'finish'
  const [selectedBookingId, setSelectedBookingId] = useState(null);
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

  const openConfirmationModal = (actionType, bookingId) => {
    setModalAction(actionType);
    setSelectedBookingId(bookingId);
    setIsModalVisible(true);
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await deleteDoc(bookingRef);
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleMarkAsFinished = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "finished" });
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "finished" }
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleConfirm = async () => {
    if (modalAction === "delete") {
      await handleDeleteBooking(selectedBookingId);
    } else if (modalAction === "finish") {
      await handleMarkAsFinished(selectedBookingId);
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      {/* Back to Profile Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Booking List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.listHeader}>Booking List</Text>}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.bookingText}>
              Created At: {item.createdAt?.toDate().toLocaleString()}
            </Text>
            <Text style={styles.bookingText}>Date: {item.date}</Text>
            <View style={styles.bookingDetails}>
              <Text style={styles.bookingText}>
                Barber: <Text style={styles.barberName}>{item.barber}</Text>
              </Text>
              <Text style={styles.bookingText}>Appointment Date: {item.date}</Text>
              <Text style={styles.bookingText}>Name: {item.name}</Text>
              <Text style={styles.bookingText}>Phone: {item.phone}</Text>
              <Text style={styles.bookingText}>Email: {item.email}</Text>
              <Text style={styles.bookingText}>Time: {item.time}</Text>
              <Text style={styles.bookingText}>Status: {item.status}</Text>
            </View>

            <View style={styles.buttonsContainer}>
              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => openConfirmationModal("delete", item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>

              {/* Mark as Finished Button (only if pending) */}
              {item.status === "pending" && (
                <TouchableOpacity
                  style={styles.finishButton}
                  onPress={() => openConfirmationModal("finish", item.id)}
                >
                  <Text style={styles.finishButtonText}>Mark as Finished</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {modalAction === "delete"
                ? "Are you sure you want to delete this booking?"
                : "Are you sure to mark this booking as done?"}
            </Text>

            <View style={styles.modalButtons}>
              
              <Pressable
                style={styles.modalButtonCancel}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>

                <Pressable
                style={styles.modalButtonYes}
                onPress={handleConfirm}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#232423",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ffffff",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#ffffff",
  },
  bookingItem: {
    padding: 20,
    backgroundColor: "#333",
    marginBottom: 15,
    borderRadius: 10,
    borderColor: "#444",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  bookingText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#fff",
  },
  barberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6A5ACD",
  },
  bookingDetails: {
    marginTop: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  finishButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    marginLeft: 10,
  },
  finishButtonText: {
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
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "%",
    backgroundColor: "#2f2f2f",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: 'white'
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  modalButtonYes: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  modalButtonCancel: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
