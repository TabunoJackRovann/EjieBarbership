import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const BookingScreen = ({ route }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookButtonDisabled, setBookButtonDisabled] = useState(true);

  // Get barber info from route params
  const { selectedBarber: barber } = route.params;

  const timeSlots = ['10:30AM', '11:00AM', '11:30AM', '12:00PM', '12:30PM'];

  const handleBooking = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        Alert.alert('Authentication Required', 'Please log in to make a booking');
        return;
      }

      await addDoc(collection(db, 'bookings'), {
        barber,
        date: selectedDate,
        time: selectedTime,
        name,
        phone,
        email: user.email,
        createdAt: Timestamp.now(),
      });

      Alert.alert(
        'Booking Confirmed!',
        `Thank you, ${name}! Your appointment with ${barber} on ${selectedDate} at ${selectedTime} has been booked.`
      );

      setSelectedDate('');
      setSelectedTime('');
      setName('');
      setPhone('');
    } catch (error) {
      console.error('Booking Error:', error);
      Alert.alert('Error', 'Failed to book. Please try again later.');
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTime && name && phone && barber) {
      setBookButtonDisabled(false);
    } else {
      setBookButtonDisabled(true);
    }
  }, [selectedDate, selectedTime, name, phone, barber]);

  const handleDateSelect = (date) => {
    if (selectedDate === date.dateString) {
      setSelectedDate('');
    } else {
      setSelectedDate(date.dateString);
      Alert.alert('Selected Date', `You selected ${date.dateString}`);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(selectedTime === time ? '' : time);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Your Appointment</Text>

      <View style={styles.scheduleContainer}>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          minDate={new Date().toISOString().split('T')[0]}
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#4CAF50',
              selectedTextColor: 'white',
            },
          }}
          monthFormat={'yyyy MM'}
          markingType={'simple'}
          style={styles.calendar}
        />

        <View style={styles.timeContainer}>
          <Text style={styles.label}>Choose Time</Text>
          {timeSlots.map((time) => (
            <Pressable
              key={time}
              style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
              onPress={() => handleTimeSelect(time)}
            >
              <Text style={styles.timeText}>{time}</Text>
            </Pressable>
          ))}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <Text style={styles.selectedDateText}>
        {selectedDate ? `You selected: ${selectedDate}` : 'No date selected'}
      </Text>

      <Pressable
        style={[styles.bookButton, bookButtonDisabled && styles.disabledButton]}
        onPress={handleBooking}
        disabled={bookButtonDisabled}
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </Pressable>

      <Pressable
        style={styles.bookButton2}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Cancel Booking</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  calendar: {
    width: 470,
    marginLeft: 250,
    marginTop: 20
  },
  timeContainer: {
    marginRight: 750,
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
  },
  selectedTimeButton: {
    backgroundColor: '#0D47A1',
  },
  timeText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 20,
    position: 'absolute',
    marginLeft: 170,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: 200,
  },
  selectedDateText: {
    fontSize: 18,
    marginTop: 30,
    textAlign: 'center',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 280,
    marginLeft: 425,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },
  bookButton2: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 340,
    marginLeft: 390,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },
  disabledButton: {
    backgroundColor: '#D3D3D3',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookingScreen;
