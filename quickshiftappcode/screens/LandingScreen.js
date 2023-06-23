import { StyleSheet, View, Image } from "react-native";
import { auth } from "../utils/firebaseUtils";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useEffect } from "react";

const LandingScreen = ({ navigation }) => {
  useEffect(() => {
    if (auth.currentUser) {
      navigation.replace("Home", { screen: "HomeScreen" });
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.fileIcon}>
        <Image source={require("../assets/icon.png")} style={styles.icon} />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          style={styles.button}
          onPress={() =>
            navigation.navigate("SignUp", {
              screen: "SignUpScreen",
            })
          }
        >
          SignUp
        </PrimaryButton>
        <PrimaryButton
          style={styles.button}
          onPress={() =>
            navigation.navigate("Login", { screen: "LoginScreen" })
          }
        >
          Login
        </PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fileIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#8dd7af", // slightly lighter green
    borderRadius: 20, // make it more rounded
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    minWidth: 150,
  },

  icon: {
    width: 400,
    height: 400,
  },
});

export default LandingScreen;
