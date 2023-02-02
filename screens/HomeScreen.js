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

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const dBCall = async () => {
    setLoading(true);
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    console.log("homedocsnapdata", docSnap.data());
    setUser(docSnap.data());
    setLoading(false);
  };

  useEffect(() => {
    dBCall();
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
      if (user.isEmployer) {
        navigation.replace("EmployerHome", {
          userDetails: user,
        });
      } else {
        navigation.replace("EmployeeHome", {
          userDetails: user,
        });
      }
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
        <Text style={styles.header}>Email:{user.displayName}</Text>
        <PrimaryButton onPress={handleSubmit}>Homepage</PrimaryButton>
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
