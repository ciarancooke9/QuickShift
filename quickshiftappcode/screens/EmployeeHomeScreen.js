import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Linking,
} from "react-native";
import { useState, useCallback } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { useFocusEffect } from "@react-navigation/native";

import { collection, getDocs, query, where } from "firebase/firestore";
import PrimaryButton from "../components/ui/PrimaryButton";
import AdvertsList from "../components/AdvertsList";

const EmployeeHomeScreen = ({ navigation, route }) => {
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      const fetchEmployee = async () => {
        const q = query(
          collection(db, "Employees"),
          where("email", "==", auth.currentUser.email)
        );

        try {
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            setEmployeeDetails(doc.data());
          });
          setLoading(false);
        } catch (e) {
          // Handle error
        }
      };

      fetchEmployee();

      return () => {};
    }, [route])
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await auth.signOut();
      navigation.replace("Welcome");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLinkPress = () => {
    Linking.openURL("https://quickshift-411c0.web.app");
  };

  return (
    <View>
      {loading || Object.keys(employeeDetails).length === 0 ? (
        <ActivityIndicator />
      ) : (
        <>
          <AdvertsList employeeDetails={employeeDetails} />

          <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
          <Text style={styles.link} onPress={handleLinkPress}>
            Need more information? Visit our website!
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    fontSize: 20,
    marginTop: 30,
    textAlign: "center",
    color: "green",
    textDecorationLine: "underline",
    marginVertical: 10,
  },
});

export default EmployeeHomeScreen;
