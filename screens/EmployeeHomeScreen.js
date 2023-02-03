import { StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseUtils";

import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import PrimaryButton from "../components/ui/PrimaryButton";
import AdvertsList from "../components/AdvertsList";
const EmployeeHomeScreen = ({ navigation, routes }) => {
  const [employeeDetails, setEmployeeDetails] = useState({});

  const employeeDBCall = async () => {
    const q = query(
      collection(db, "Employees"),
      where("email", "==", auth.currentUser.email)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      setEmployeeDetails(doc.data());
      console.log("employeedbcall", employeeDetails);
    });
  };

  useEffect(() => {
    employeeDBCall();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <AdvertsList employeeDetails={employeeDetails} />

      <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
    </View>
  );
};

export default EmployeeHomeScreen;

const styles = StyleSheet.create({});
