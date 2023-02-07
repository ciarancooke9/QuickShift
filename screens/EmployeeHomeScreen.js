import { StyleSheet, View } from "react-native";
import React, { useState, useCallback } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { useFocusEffect } from "@react-navigation/native";

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
  const [loading, setLoading] = useState(false);

  /* const employeeDBCall = async () => {
    setLoading(true);
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
    setLoading(false);
  }; */

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);

      const fetchEmployee = async () => {
        const q = query(
          collection(db, "Employees"),
          where("email", "==", auth.currentUser.email)
        );

        try {
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            setEmployeeDetails(doc.data());
            console.log("employeedbcall", employeeDetails);
          });
          setLoading(false);
        } catch (e) {
          // Handle error
        }
      };

      fetchEmployee();

      return () => {
        setLoading(false);
      };
    }, [routes])
  );

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
