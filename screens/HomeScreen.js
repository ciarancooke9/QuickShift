import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import { auth, db } from "../utils/firebaseUtils";

import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { async } from "@firebase/util";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const dBCall = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
  };

  useEffect(() => {
    dBCall();
    /* user.isEmployer //redirect based on user type
      ? navigation.replace("EmployeeHome", { user: user })
      : navigation.replace("EmployerHome", { user: user }); */
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.displayName}</Text>
      </View>
    );
  };

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
      <ScrollView>
        <Text style={styles.header}>
          Email:{JSON.stringify(auth.currentUser.uid)}
        </Text>
        <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
  },
});
