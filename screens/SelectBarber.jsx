// screens/SelectBarber.js
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { barbers } from '../constants/barbers'; // Import barber options

const SelectBarber = ({ navigation }) => {
  const [selectedBarber, setSelectedBarber] = useState('');

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
  };

  const handleProceed = () => {
    if (!selectedBarber) {
      Alert.alert('Please select a barber before proceeding.');
      return;
    }
    navigation.navigate("Booking", { selectedBarber });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Barber</Text>
      {barbers.map((barber) => (
        <Pressable
          key={barber}
          style={[
            styles.barberButton,
            selectedBarber === barber && styles.selectedBarberButton,
          ]}
          onPress={() => handleBarberSelect(barber)}
        >
          <Text style={styles.barberText}>{barber}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.proceedText}>Proceed</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  barberButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 12,
    width: 250,
    alignItems: 'center',
  },
  selectedBarberButton: {
    backgroundColor: '#6A1B9A',
  },
  barberText: {
    color: 'white',
    fontSize: 18,
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  proceedText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SelectBarber;
