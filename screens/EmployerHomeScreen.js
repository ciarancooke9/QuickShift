import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../utils/firebaseUtils";
import { collection, getDocs, query, where } from "firebase/firestore";

const EmployerHomeScreen = ({ routes, navigation }) => {
  const [employerDetails, setEmployerDetails] = useState({});
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);

      const fetchEmployer = async () => {
        const q = query(
          collection(db, "Employers"),
          where("email", "==", auth.currentUser.email)
        );

        try {
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            setEmployerDetails(doc.data());
            console.log("employerdbcall", employerDetails);
          });
          setLoading(false);
        } catch (e) {
          // Handle error
        }
      };

      fetchEmployer();

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
