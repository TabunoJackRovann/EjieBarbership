import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, TextInput, ScrollView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const BookingScreen = ({ route, navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookButtonDisabled, setBookButtonDisabled] = useState(true);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const { selectedBarber: barber } = route.params;
  const timeSlots = ['10:30AM', '11:00AM', '11:30AM', '12:00PM', '12:30PM'];

  useEffect(() => {
    const checkExistingBooking = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setHasExistingBooking(true);
        Alert.alert(
          'Booking Exists',
          'You already have an existing booking. You must cancel it before creating a new one.'
        );
      }
    };

    checkExistingBooking();
  }, []);

  const handleBooking = async () => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to make a booking');
      return;
    }

    if (hasExistingBooking) {
      Alert.alert('Booking Blocked', 'You already have an existing booking. Please cancel it first.');
      return;
    }

    // Add the booking with a 'pending' status
    await addDoc(collection(db, 'bookings'), {
      barber,
      date: selectedDate,
      time: selectedTime,
      name,
      phone,
      email: user.email,
      createdAt: Timestamp.now(),
      status: 'pending',  // New status field added here
    });

    Alert.alert(
      'Booking Confirmed!',
      `Thank you, ${name}! Your appointment with ${barber} on ${selectedDate} at ${selectedTime} has been booked.`
    );

    // Clear the selected date, time, and reset other states
    setSelectedDate('');
    setSelectedTime('');
    setName('');
    setPhone('');
    setMarkedDates({}); // Clear the marked date in the calendar

    setHasExistingBooking(true); // Prevent further bookings

  } catch (error) {
    console.error('Booking Error:', error);
    Alert.alert('Error', 'Failed to book. Please try again later.');
  }
};

  

  useEffect(() => {
    if (selectedDate && selectedTime && name && phone && barber && !hasExistingBooking) {
      setBookButtonDisabled(false);
    } else {
      setBookButtonDisabled(true);
    }
  }, [selectedDate, selectedTime, name, phone, barber, hasExistingBooking]);

  const handleDateSelect = (date) => {
    if (selectedDate === date.dateString) {
      setSelectedDate('');
      setMarkedDates((prev) => ({
        ...prev,
        [date.dateString]: { selected: false },
      }));
    } else {
      setSelectedDate(date.dateString);
      setMarkedDates({
        [date.dateString]: {
          selected: true,
          selectedColor: '#2B4620',
          selectedTextColor: 'white',
        },
      });
      Alert.alert('Selected Date', `You selected ${date.dateString}`);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(selectedTime === time ? '' : time);
  };

  const isMobile = screenWidth <= 768;
  const containerStyle = isMobile ? styles.mobileContainer : styles.desktopContainer;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Book Your Appointment</Text>

      <View style={[styles.scheduleContainer, containerStyle]}>
        <View style={[styles.calendarContainer, isMobile && styles.fullWidthContainer]}>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            minDate={new Date().toISOString().split('T')[0]}
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            markingType={'custom'}
            style={styles.calendar}
          />
        </View>

        <View style={[styles.formContainer, isMobile && styles.fullWidthContainer]}>
          <Text style={styles.selectedDateText}>
            {selectedDate ? `You selected: ${selectedDate}` : 'No date selected'}
          </Text>

          <View style={[styles.timeAndInputRow, !isMobile && { marginLeft: 20 }]}>
            <View style={styles.timeContainer}>
              {timeSlots.map((time) => (
                <Pressable
                  key={time}
                  style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: 'white' }]}
                placeholder="Enter Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={[styles.input, { color: 'white' }]}
                placeholder="Enter Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
              />

              <Pressable
                style={[styles.bookButton, bookButtonDisabled && styles.disabledButton]}
                onPress={handleBooking}
                disabled={bookButtonDisabled}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </Pressable>

              <Pressable style={styles.bookButton2} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.buttonText}>Cancel Booking</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#232423',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Kristi',
    marginBottom: 10,
  },
  scheduleContainer: {
    backgroundColor: '#2f2f2f',
    margin: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: 3000,
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  desktopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    marginLeft: 150,
    width: '55%',
    flexWrap: 'wrap',
  },
  mobileContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  calendarContainer: {
    width: '50%',
    maxWidth: 900,
  },
  formContainer: {
    width: '48%',
    maxWidth: 700,
    alignSelf: 'flex-start',
  },
  fullWidthContainer: {
    width: '100%',
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    height: 320,
    borderWidth: 4,
    borderColor: 'black',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: 'gray',
  },
  timeAndInputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 0,
  },
  timeContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '45%',
    marginRight: 10,
  },
  timeButton: {
    backgroundColor: '#454343',
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 6,
    width: 90,
  },
  selectedTimeButton: {
    backgroundColor: '#2B4620',
  },
  timeText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedTimeText: {
    color: 'white',
  },
  inputContainer: {
    width: '50%',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  input: {
    backgroundColor: "#454343",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    fontSize: 16,
    color: 'white',
  },
  selectedDateText: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
    color: 'gray',
    fontFamily: 'Kristi',
  },
  bookButton: {
    backgroundColor: '#2B4620',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 15,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: 'Kristi',
  },
  bookButton2: {
    backgroundColor: '#650F0F',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 15,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: 'Kristi',
  },
  disabledButton: {
    backgroundColor: '#535050',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Kristi',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Kristi',
  },
});

export default BookingScreen;
