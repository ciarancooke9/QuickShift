import { StyleSheet, View } from "react-native";
import { auth } from "../utils/firebaseUtils";
import PrimaryButton from "../components/ui/PrimaryButton";

const LandingScreen = ({ navigation }) => {
  console.log(auth.currentUser);
  if (auth.currentUser) {
    navigation.replace("Home", { screen: "HomeScreen" });
  }

  return (
    <View>
      <PrimaryButton
        onPress={() =>
          navigation.navigate("SignUp", {
            screen: "SignUpScreen",
          })
        }
      >
        SignUp
      </PrimaryButton>
      <PrimaryButton
        onPress={() => navigation.navigate("Login", { screen: "LoginScreen" })}
      >
        Login
      </PrimaryButton>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({});
