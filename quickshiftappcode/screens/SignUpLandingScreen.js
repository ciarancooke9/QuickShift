import { StyleSheet, View } from "react-native";
import React from "react";

import PrimaryButton from "../components/ui/PrimaryButton";

const SignUpLandingScreen = ({ navigation }) => {
  return (
    <View>
      <PrimaryButton
        onPress={() =>
          navigation.navigate("EmployerSignUp", {
            screen: "EmployeeSignUpScreen",
          })
        }
      >
        Employer Sign-up
      </PrimaryButton>
      <PrimaryButton
        onPress={() =>
          navigation.navigate("EmployeeSignUp", {
            screen: "EmployeeSignUpScreen",
          })
        }
      >
        Worker Sign-up
      </PrimaryButton>
    </View>
  );
};

export default SignUpLandingScreen;

const styles = StyleSheet.create({});
