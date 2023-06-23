import { StyleSheet, Text, View, Image, Linking } from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../utils/firebaseUtils";
import { collection, getDocs, query, where } from "firebase/firestore";

import AdvertListEmployer from "../components/AdvertListEmployer";

const EmployerHomeScreen = ({ route, navigation }) => {
  const [employerDetails, setEmployerDetails] = useState({});
  const [loading, setLoading] = useState(false);
  console.log(route);
  useFocusEffect(
    useCallback(() => {
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
    }, [route])
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      auth.signOut();
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
      <PrimaryButton
        onPress={() =>
          navigation.navigate("AdvertCreateForm", {
            screen: "AdvertCreateFormScreen",
            employer: employerDetails,
          })
        }
      >
        Create Shift
      </PrimaryButton>

      <AdvertListEmployer
        employerDetails={employerDetails}
        navigation={navigation}
      />

      <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
      <Text style={styles.link} onPress={handleLinkPress}>
        Need more information? Visit our website!
      </Text>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/just-logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
    </View>
  );
};

export default EmployerHomeScreen;

const styles = StyleSheet.create({
  logoContainer: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 400,
  },
  link: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
    color: "green",
    textDecorationLine: "underline",
  },
});
