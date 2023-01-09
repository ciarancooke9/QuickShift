import { StyleSheet, Text, View } from "react-native";
import React from "react";

import PrimaryButton from "../components/ui/PrimaryButton";

const LandingScreen = ({ navigation }) => {
  return (
    <View>
      <PrimaryButton
        onPress={() =>
          navigation.navigate("SignUp", { screen: "SignUpScreen" })
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
