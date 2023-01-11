import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { auth } from "../utils/firebaseUtils";
import SignOutButton from "../components/ui/SignOutButton";
const EmployeeHomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>{auth.currentUser.email}</Text>
      <SignOutButton navigation={navigation} />
    </View>
  );
};

export default EmployeeHomeScreen;

const styles = StyleSheet.create({});
