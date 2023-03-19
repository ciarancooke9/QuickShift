import { StyleSheet, View, ActivityIndicator } from "react-native";
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
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      {loading || Object.keys(employeeDetails).length === 0 ? (
        <ActivityIndicator />
      ) : (
        <>
          <AdvertsList employeeDetails={employeeDetails} />
          <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
        </>
      )}
    </View>
  );
};

export default EmployeeHomeScreen;

const styles = StyleSheet.create({});
