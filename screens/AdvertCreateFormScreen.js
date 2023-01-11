import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { auth, db } from "../utils/firebaseUtils";
import { collection, addDoc } from "firebase/firestore";
import PrimaryButton from "../components/ui/PrimaryButton";
//import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const AdvertCreateFormScreen = ({ route, navigation }) => {
  const { user } = route.params;
  console.log("advertform");
  console.log(user);
  const [advert, setAdvert] = useState({
    hours: null,
    pay: null,
    time: "",
    type: "",
  });
  const [selected, setSelected] = useState("");

  const type = [
    "Barwork",
    "Table Waiting",
    "Mixology",
    "Security",
    "Kitchen Work",
  ];

  const handleSubmit = async (event) => {
    console.log("button hit");
    event.preventDefault();

    try {
      const advertsDb = collection(db, "adverts");
      addDoc(advertsDb, {
        location: user.address,
        employer: auth.currentUser.email,
        type: selected,
        hours: advert.hours,
        time: advert.time,
        pay: advert.pay,
      });
      navigation.replace("Home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("advert creation encountered an error", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <TextInput
          placeholder="hours"
          value={advert.hours}
          onChangeText={(text) => setAdvert({ ...advert, hours: text })}
          keyboardType="numeric"
        ></TextInput>
        <TextInput
          placeholder="pay"
          value={advert.pay}
          onChangeText={(text) => setAdvert({ ...advert, pay: text })}
          keyboardType="numeric"
        ></TextInput>
        <SelectList
          setSelected={(val) => setSelected(val)}
          data={type}
          save="value"
          label="Categories"
        />
      </View>
      <Text>{auth.currentUser.email}</Text>
      <PrimaryButton onPress={handleSubmit}>Register</PrimaryButton>
    </KeyboardAvoidingView>
  );
};

export default AdvertCreateFormScreen;

const styles = StyleSheet.create({});
