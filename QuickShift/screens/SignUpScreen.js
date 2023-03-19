import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  View,
} from "react-native";
import CheckBox from "expo-checkbox";
import React, { useState } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../utils/firebaseUtils";

const SignupScreen = ({ navigation }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmployer, setIsEmployer] = useState(false);

  const handleSubmit = async (event) => {
    console.log("button hit");
    event.preventDefault();

    if (password !== confirmPassword) {
      console.log("passwords dont match");
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password,
        isEmployer,
        displayName
      );
      await createUserDocumentFromAuth(user, {
        email,
        isEmployer,
        displayName,
      });
      console.log(email);
      isEmployer
        ? navigation.replace("EmployerSignUp")
        : navigation.replace("EmployeeSignUp");
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
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        ></TextInput>
        <TextInput
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
        ></TextInput>
        <Text>Tick box if you are an employer, if worker leave unticked</Text>
        <CheckBox
          value={isEmployer}
          onValueChange={setIsEmployer}
          style={styles.checkbox}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        ></TextInput>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        ></TextInput>
      </View>
      <PrimaryButton onPress={handleSubmit}>Register</PrimaryButton>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

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
