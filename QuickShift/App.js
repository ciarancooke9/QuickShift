import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

export default function App() {
  const initialRouteName = auth.currentUser ? "Home" : "Landing";
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
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
