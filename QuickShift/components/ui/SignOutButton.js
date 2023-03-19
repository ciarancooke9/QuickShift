import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PrimaryButton from "./PrimaryButton";
import { auth } from "../../utils/firebaseUtils";

const SignOutButton = ({ navigation }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      auth.signOut();
      navigation.replace("Landing");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
    </View>
  );
};

export default SignOutButton;

const styles = StyleSheet.create({});
