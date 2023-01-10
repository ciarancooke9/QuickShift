import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import { auth, db } from "../utils/firebaseUtils";
import { collection, doc, onSnapshot } from "firebase/firestore";

const HomeScreen = ({ navigation }) => {
  const [people, setPeople] = useState([]);
  //const [loading, setLoading] = useState(false);

  useEffect(() => {
    //setLoading(true);
    const userQuery = collection(db, "users");
    onSnapshot(userQuery, (snapshot) => {
      let usersList = [];
      snapshot.docs.map((doc) => usersList.push({ ...doc.data(), id: doc.id }));
      setPeople(usersList);
      //setLoading(false);
    });
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

  console.log(people);
  return (
    <View>
      <Text style={styles.header}>Email:{auth.currentUser.email}</Text>
      <FlatList
        data={people}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
