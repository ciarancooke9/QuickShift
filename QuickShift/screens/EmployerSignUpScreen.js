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

const EmployerSignupScreen = ({ navigation }) => {
  const [employer, setEmployer] = useState({
    businessType: "",
    businessName: "",
    location: "",
    description: "",
    address: "",
  });

  const handleSubmit = async (event) => {
    console.log("button hit");
    event.preventDefault();

    try {
      const userDb = collection(db, "Employers");
      addDoc(userDb, {
        location: employer.location,
        description: employer.description,
        address: employer.address,
        businessName: employer.businessName,
        businessType: employer.businessType,
        trustFactor: 100,
        email: auth.currentUser.email,
        userID: auth.currentUser.uid,
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
          value={employer.businessName}
          onChangeText={(text) =>
            setEmployer({ ...employer, businessName: text })
          }
        ></TextInput>
        <TextInput
          placeholder="Type"
          value={employer.businessType}
          onChangeText={(text) =>
            setEmployer({ ...employer, businessType: text })
          }
        ></TextInput>
        <TextInput
          placeholder="Description"
          value={employer.description}
          onChangeText={(text) =>
            setEmployer({ ...employer, description: text })
          }
        ></TextInput>
        <TextInput
          placeholder="address"
          value={employer.address}
          onChangeText={(text) => setEmployer({ ...employer, address: text })}
        ></TextInput>
        <TextInput
          placeholder="Location"
          value={employer.location}
          onChangeText={(text) => setEmployer({ ...employer, location: text })}
        ></TextInput>
      </View>

      <PrimaryButton onPress={handleSubmit}>Register</PrimaryButton>
    </KeyboardAvoidingView>
  );
};

export default EmployerSignupScreen;

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
