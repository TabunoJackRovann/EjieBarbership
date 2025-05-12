import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Easing
} from "react-native";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import Logo from "../assets/Logo.png";
import { admin } from '../constants/admin';

export default function ProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [unauthorizedAttempts, setUnauthorizedAttempts] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { width } = useWindowDimensions();
  const [sidebarAnim] = useState(new Animated.Value(-300)); // initial off-screen position

  const isSmallScreen = width <= 600;
  const user = auth.currentUser;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const toValue = !prev ? 0 : -300; // 0 when open, -300 when closed

      Animated.timing(sidebarAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();

      return !prev;
    });
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate("Login");
      }, 3000);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  const handleManageUsers = () => {
    if (admin.includes(user.email)) {
      setError("");
      setUnauthorizedAttempts(0);
      navigation.navigate("CRUD");
    } else {
      const newAttempts = unauthorizedAttempts + 1;
      setUnauthorizedAttempts(newAttempts);
      setError(newAttempts % 2 !== 0 ? "You are not authorized to access Admin panel." : "");
    }
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

      {/* Sidebar with Sliding Animation */}
      {isSmallScreen && (
        <Animated.View
          style={[
            styles.sidebar,
            {
              left: sidebarAnim, // Applying the animated value for sliding effect
            },
          ]}
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

      {/* Profile Content */}
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6A5ACD" />
        ) : (
          user && (
            <View style={styles.card}>
              {/* Back Button */}
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </Pressable>

              <Text style={styles.header}>Welcome,</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.createdAt}>
                Account Created: {new Date(user.metadata.creationTime).toLocaleDateString()}
              </Text>

              <Pressable style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.adminButton]} onPress={handleManageUsers}>
                <Text style={styles.buttonText}>Admin Access</Text>
              </Pressable>

              {error !== "" && <Text style={styles.errorText}>{error}</Text>}
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232423",
  },
  backButton: {
    backgroundColor: "#454343",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    position: "absolute",
    top: -17,
    left: -5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#2f2f2f",
    padding: 25,
    borderRadius: 15,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 5,
    position: "relative", // Ensure the back button is positioned relative to the card
  },
  header: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 6,
  },
  createdAt: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  adminButton: {
    backgroundColor: "#6A5ACD",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
