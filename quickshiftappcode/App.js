import { StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StripeProvider } from "@stripe/stripe-react-native";
import messaging from "@react-native-firebase/messaging";
import storage from "@react-native-firebase/storage";
import inAppMessaging from "@react-native-firebase/in-app-messaging";
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
import MapScreen from "./screens/MapScreen";
import PlaceDetailsScreen from "./screens/PlaceDetailsScreen";
import ReviewScreen from "./screens/ReviewScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import PastReviewsScreen from "./screens/PastReviewsScreen";
const Stack = createNativeStackNavigator();

// Register background handler

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Landing");

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
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

    const subscriber = auth.onAuthStateChanged((user) => {
      setLoading(false);
      if (user) {
        setInitialRoute("Home");
      } else {
        setInitialRoute("Landing");
      }
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
      });

    return () => {
      unsubscribe();
      subscriber();
    };
  }, []);
  if (loading) {
    return null;
  }

  return (
    <StripeProvider publishableKey="pk_test_51MsuI4FJODkgVFp86n0XxnStzVcnx2ySOmwuTc4mKjE6eAWZhdCSaHRNUAvbb5xVx5wVNPIjKb1iizNy2LubKn1g00ogSlFev7">
      <NavigationContainer>
        <Stack.Navigator initialRoute={initialRoute}>
          <Stack.Screen
            name="Welcome"
            component={LandingScreen}
            options={{
              headerTitle: "Welcome",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="SignUpLanding" component={SignupLandingScreen} />
          <Stack.Screen
            name="EmployerSignUp"
            component={EmployerSignupScreen}
          />
          <Stack.Screen
            name="EmployeeSignUp"
            component={EmployeeSignupScreen}
          />
          <Stack.Screen name="EmployerHome" component={EmployerHomeScreen} />
          <Stack.Screen name="EmployeeHome" component={EmployeeHomeScreen} />
          <Stack.Screen
            name="AdvertCreateForm"
            component={AdvertCreateFormScreen}
          />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="ViewApplicants"
            component={ViewApplicantsScreen}
          />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="PastReviews" component={PastReviewsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
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
