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
  console.log(route.params);
  console.log(auth.currentUser.email);
  const { user } = route.params;
  return (
    <View>
      <PrimaryButton
        onPress={() =>
          navigation.navigate("AdvertCreateForm", {
            screen: "AdvertCreateFormScreen",
            user: user,
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
