import { StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import messaging from "@react-native-firebase/messaging";
//import { PermissionsAndroid } from "react-native";
import { auth } from "./utils/firebaseUtils";
import LandingScreen from "./screens/LandingScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupLandingScreen from "./screens/SignUpLandingScreen";
import EmployeeSignupScreen from "./screens/EmployeeSignUpScreen";
import EmployerSignupScreen from "./screens/EmployerSignUpScreen";
import EmployeeHomeScreen from "./screens/EmployeeHomeScreen";
import EmployerHomeScreen from "./screens/EmployerHomeScreen";
import AdvertCreateFormScreen from "./screens/AdvertCreateFormScreen";
import SignupScreen from "./screens/SignUpScreen";
import ViewApplicantsScreen from "./screens/ViewApplicantsScreen";
import ChatScreen from "./screens/ChatScreen";
const Stack = createNativeStackNavigator();
// Register background handler

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Landing");

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    messaging()
      .getToken()
      .then((token) => {
        console.log("app fcm token", token);
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
      //navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });

    return unsubscribe;
  }, []);
  if (loading) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRoute={initialRoute}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="SignUpLanding" component={SignupLandingScreen} />
        <Stack.Screen name="EmployerSignUp" component={EmployerSignupScreen} />
        <Stack.Screen name="EmployeeSignUp" component={EmployeeSignupScreen} />
        <Stack.Screen name="EmployerHome" component={EmployerHomeScreen} />
        <Stack.Screen name="EmployeeHome" component={EmployeeHomeScreen} />
        <Stack.Screen
          name="AdvertCreateForm"
          component={AdvertCreateFormScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ViewApplicants" component={ViewApplicantsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 50,
  },
});
