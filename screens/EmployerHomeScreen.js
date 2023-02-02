import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import React from "react";
import { auth } from "../utils/firebaseUtils";

const EmployerHomeScreen = ({ route, navigation }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
    }
  };
  console.log("employerHome", route.params.userDetails);
  const user = route.params.userDetails;
  console.log("employerHome", user);
  return (
    <View>
      <PrimaryButton
        onPress={() =>
          navigation.navigate("AdvertCreateForm", {
            screen: "AdvertCreateFormScreen",
            userDetails: user,
          })
        }
      >
        Create Shift
      </PrimaryButton>
      <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
    </View>
  );
};

export default EmployerHomeScreen;

const styles = StyleSheet.create({});
