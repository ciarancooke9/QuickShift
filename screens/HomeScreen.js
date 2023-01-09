import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import { auth } from "../utils/firebaseUtils";
import { useNavigation } from "@react-navigation/native";
const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <View>
      <Text style={styles.header}>Email:{auth.currentUser.email}</Text>
      <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
  },
});
