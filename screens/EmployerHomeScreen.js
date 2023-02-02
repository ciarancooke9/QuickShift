import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { collection, getDocs, query, where } from "firebase/firestore";

const EmployerHomeScreen = ({ route, navigation }) => {
  const [employerDetails, setEmployerDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const dBCall = async () => {
    setLoading(true);
    const q = query(
      collection(db, "Employers"),
      where("email", "==", auth.currentUser.email)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      setEmployerDetails(doc.data());
      console.log("employerHome", employerDetails);
    });
    /* const docRef = doc(db, "Employers");
    const docSnap = await getDocs(docRef);
    console.log("advertFormDocSnap", docSnap.data());
    setEmployerDetails(docSnap.data()); */
    setLoading(false);
  };

  useEffect(() => {
    dBCall();
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
      <PrimaryButton
        onPress={() =>
          navigation.navigate("AdvertCreateForm", {
            screen: "AdvertCreateFormScreen",
            userDetails: route.params.userDetails,
            employer: employerDetails,
          })
        }
      >
        Create Shift
      </PrimaryButton>
      <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
    </View>
  );
};

export default EmployerHomeScreen;

const styles = StyleSheet.create({});
