import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import { auth, db } from "../utils/firebaseUtils";
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";

const EmployeeSignupScreen = ({ navigation }) => {
  const [employee, setEmployee] = useState({
    fullName: "",
    location: "",
    description: "",
    experience: [],
  });

  const handleSubmit = async (event) => {
    console.log("button hit");
    event.preventDefault();

    try {
      const userDb = collection(db, "Employees");
      addDoc(userDb, {
        location: employee.location,
        description: employee.description,
        experience: [],
        fullName: employee.fullName,
        email: auth.currentUser.email,
        trustFactor: 100,
      });
      navigation.replace("Home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <TextInput
          placeholder="Name"
          value={employee.fullName}
          onChangeText={(text) => setEmployee({ ...employee, fullName: text })}
        ></TextInput>
        <TextInput
          placeholder="Description"
          value={employee.description}
          onChangeText={(text) =>
            setEmployee({ ...employee, description: text })
          }
        ></TextInput>
        {/* <TextInput
          placeholder="experience"
          value={employee.experience}
          onChangeText={(text) =>
            setEmployee({ ...employee, experience: text })
          }
        ></TextInput> */}
        <TextInput
          placeholder="Location"
          value={employee.location}
          onChangeText={(text) => setEmployee({ ...employee, location: text })}
        ></TextInput>
      </View>
      <Text>{auth.currentUser.email}</Text>
      <PrimaryButton onPress={handleSubmit}>Register</PrimaryButton>
    </KeyboardAvoidingView>
  );
};

export default EmployeeSignupScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
});
