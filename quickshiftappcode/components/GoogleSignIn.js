import React from "react";
import { View, Button } from "react-native";
import { auth, googleProvider } from "../utils/firebaseUtils";
import { GoogleSignIn } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "",
});

function GoogleSignIn() {
  return (
    <Button
      title="Google Sign-In"
      onPress={() =>
        onGoogleButtonPress().then(() => console.log("Signed in with Google!"))
      }
    />
  );
}

export default GoogleSignIn;
