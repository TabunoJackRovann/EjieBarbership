// screens/SelectBarber.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { barbers } from '../constants/barbers';
import Logo from "../assets/Logo.png"; // same logo as HomeScreen

const SelectBarber = ({ navigation }) => {
  const [selectedBarber, setSelectedBarber] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isSmallScreen = width <= 600;
  const barberButtonWidth = isSmallScreen ? '50%' : '20%';

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleBarberSelect = (barber) => {
    if (selectedBarber === barber) {
      setSelectedBarber('');
    } else {
      setSelectedBarber(barber);
    }
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
      {/* Navbar */}
      <View style={styles.navBar}>
        <Image source={Logo} style={styles.navLogo} />
        <Text style={styles.navTitle}>THE EJIE BARBERSHOP</Text>

        {isSmallScreen ? (
          <TouchableOpacity onPress={toggleSidebar} style={styles.hamburgerMenu}>
            <View style={styles.hamburgerLine}></View>
            <View style={styles.hamburgerLine}></View>
            <View style={styles.hamburgerLine}></View>
          </TouchableOpacity>
        ) : (
          <View style={styles.middleContainer}>
            <Pressable onPress={() => navigation.navigate("Home")} style={styles.navButton}>
              <Text style={styles.navLink}>Home</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("Profile")} style={styles.navButton}>
              <Text style={styles.navLink}>Profile</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("Details")} style={styles.navButton}>
              <Text style={styles.navLink}>Details</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Sidebar */}
      {isSidebarOpen && isSmallScreen && (
        <View style={styles.sidebar}>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Text style={[styles.navLink, { color: "black" }]}>Home</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Text style={[styles.navLink, { color: "black" }]}>Profile</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Details")}>
            <Text style={[styles.navLink, { color: "black" }]}>Details</Text>
          </Pressable>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Barber</Text>
        {barbers.map((barber) => (
          <Pressable
            key={barber}
            style={[
              styles.barberButton,
              { width: barberButtonWidth },
              selectedBarber === barber && styles.selectedBarberButton,
            ]}
            onPress={() => handleBarberSelect(barber)}
          >
            <Image source={Logo} style={styles.barberLogo} />
            <Text style={styles.barberText}>{barber}</Text>
          </Pressable>
        ))}

        <Pressable style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedText}>Proceed</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232423",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
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
    fontFamily: "Kristi",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 5 },
    textShadowRadius: 3,
    flexGrow: 2,
    marginBottom: 15,
  },
  hamburgerMenu: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: 30,
    height: 20,
  },
  hamburgerLine: {
    width: "100%",
    height: 4,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "60%",
    height: "100%",
    backgroundColor: "#5B6059",
    paddingTop: 100,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    zIndex: 1000,
    borderRightWidth: 3,
    borderRightColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  navLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    fontFamily: "Kristi",
    marginBottom: 30,
    marginTop: 10,
  },
  middleContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 30,
    fontFamily: "Kristi",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 5 },
    textShadowRadius: 3
  },
  barberButton: {
    padding: 7,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 17,
    borderColor: "black",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectedBarberButton: {
    backgroundColor: '#5B6059',
  },
  barberLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  barberText: {
    color: 'white',
    fontSize: 18,
    fontFamily: "Kristi",
  },
  proceedButton: {
    backgroundColor: '#5B6059',
    marginTop: 30,
    borderWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  proceedText: {
    color: 'white',
    fontSize: 18,
    fontFamily: "Kristi",
  },
});

export default SelectBarber;
