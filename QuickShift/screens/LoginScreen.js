import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import {
  signInAuthUserWithEmailAndPassword,
  auth,
} from "../utils/firebaseUtils";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (event) => {
    console.log("button hit");
    event.preventDefault();

    try {
      const { user } = await signInAuthUserWithEmailAndPassword(
        email,
        password
      );
      console.log(email);
    } catch (error) {
      switch (error.code) {
        case "auth/wrongpassword":
          alert("incorrect password for email");
          break;
        case "auth/user-not-found":
          alert("No user with this email");
          break;
        default:
          console.log(error);
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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        ></TextInput>
      </View>
      <PrimaryButton onPress={handleSubmit}>Login</PrimaryButton>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
});
