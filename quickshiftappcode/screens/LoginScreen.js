import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
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
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/just-logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        ></TextInput>
        <PrimaryButton onPress={handleSubmit}>Login</PrimaryButton>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    position: "absolute",
    bottom: 70,
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "80%",
  },
  logo: {
    width: 500,
    height: 400,
  },
});

export default LoginScreen;
