import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
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
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/just-logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />
        <Text style={styles.checkboxLabel}>
          Tick box if you are a business looking to advertise shifts, if you're
          seeking shifts to work leave unticked
        </Text>
        <CheckBox
          value={isEmployer}
          onValueChange={setIsEmployer}
          style={styles.checkbox}
        />
        {/* PhoneSignIn component goes here */}
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <PrimaryButton onPress={handleSubmit}>Register</PrimaryButton>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 500,
    height: 400,
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  checkboxLabel: {
    marginBottom: 10,
  },
  checkbox: {
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
});
