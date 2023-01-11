import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import { auth, db } from "../utils/firebaseUtils";

import {
  collection,
  doc,
  onSnapshot,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  //const [loading, setLoading] = useState(false);

  useEffect(() => {
    //setLoading(true);
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", auth.currentUser.email)
    );
    onSnapshot(userQuery, (snapshot) => {
      let usersList = [];
      snapshot.docs.map((doc) => usersList.push({ ...doc.data(), id: doc.id }));
      setUser(usersList[0]);
      //setLoading(false);
    });
    user.isEmployer //redirect based on user type
      ? navigation.replace("EmployeeHome", { user: user })
      : navigation.replace("EmployerHome", { user: user });
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
      <Text style={styles.header}>Email:{auth.currentUser.email}</Text>
      <Text style={styles.header}>Email:{user.email}</Text>

      <PrimaryButton onPress={handleSubmit}>Sign Out</PrimaryButton>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
  },
});
