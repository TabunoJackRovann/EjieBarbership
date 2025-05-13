import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import Logo from "../assets/Logo.png"; // Adjust path if needed

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarPosition = useState(new Animated.Value(-width * 0.6))[0];

  const isSmallScreen = width <= 600;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    Animated.timing(sidebarPosition, {
      toValue: isSidebarOpen ? -width * 0.6 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
      {isSmallScreen && (
        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX: sidebarPosition }] }]}
        >
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Text style={[styles.navLink, { color: "black" }]}>Home</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Text style={[styles.navLink, { color: "black" }]}>Profile</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Details")}>
            <Text style={[styles.navLink, { color: "black" }]}>Details</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Main Content (Left Aligned) */}
      <View style={styles.content}>
        <Text style={styles.headline}>Welcome to The Ejie Barbershop</Text>

        <Text style={styles.description}>
          Book your next haircut hassle-free with our online barbershop!
          {"\n"}Choose your stylist, pick a time, and get ready to look your best.
          {"\n"}Say goodbye to waiting and hello to convenience.
        </Text>

        <Text style={styles.description}>
          Step into our barbershop and immerse yourself in the expertise of our seasoned professionals.
          {"\n"}With a keen eye for detail and years of experience,
          {"\n"}our skilled barbers guarantee precision cuts that exceed expectations every time.
        </Text>

        <Pressable
          style={styles.bookButton}
          onPress={() => navigation.navigate("SelectBarber")}
        >
          <Text style={styles.buttonText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
  content: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginTop: 35
  },
  headline: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    fontFamily: "Kristi",
  },
  description: {
    fontSize: 20,
    color: "#ddd",
    marginBottom: 20,
    lineHeight: 24,
    fontFamily: "Kristi",
    textAlign: "left",
  },
  bookButton: {
    backgroundColor: "#5B6059",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  middleContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 3,
  },
});
