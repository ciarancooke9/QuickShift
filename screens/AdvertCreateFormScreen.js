import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { auth, db } from "../utils/firebaseUtils";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import PrimaryButton from "../components/ui/PrimaryButton";
import {
  DateTimePickerAndroid,
  DateTimePicker,
} from "@react-native-community/datetimepicker";

const AdvertCreateFormScreen = ({ route, navigation }) => {
  const [employerDetails, setEmployerDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const user = route.params.userDetails;

  const dBCall = async () => {
    setLoading(true);
    const q = query(
      collection(db, "Employers"),
      where("email", "==", auth.currentUser.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      /* console.log(doc.id, " => ", doc.data());
      console.log(auth.currentUser.uid); */
      setEmployerDetails(doc.data());
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

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const [advert, setAdvert] = useState({
    hours: null,
    pay: null,
    type: "",
  });

  const type = [
    "Barwork",
    "Table Waiting",
    "Mixology",
    "Security",
    "Kitchen Work",
  ];

  const showPicker = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(false);
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: true,
      });
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showPicker("date");
  };

  const showTimepicker = () => {
    showPicker("time");
  };

  const dateExtractor = (date) => {
    let dateString = date.toLocaleString();
    dateString = dateString.trim();
    const dateTime = dateString.split(",");
    return dateTime;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const timeDate = dateExtractor(date);
    console.log(employerDetails.location);
    console.log(employerDetails.address);
    console.log(employerDetails.businessName);
    console.log(selected);
    console.log(advert.hours);
    console.log(timeDate[0], timeDate[1]);
    console.log(advert.pay);
    try {
      const advertsDb = collection(db, "adverts");
      addDoc(advertsDb, {
        location: employerDetails.location,
        address: employerDetails.address,
        employer: employerDetails.businessName,
        type: selected,
        hours: advert.hours,
        time: { date: timeDate[0], startTimeime: timeDate[1] },
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
          value={type}
          save="value"
          label="Categories"
        />
      </View>
      <PrimaryButton onPress={showDatepicker} title="Show date picker!">
        Pick Date
      </PrimaryButton>
      <PrimaryButton Button onPress={showTimepicker} title="Show time picker!">
        Pick Time
      </PrimaryButton>
      <Text>selected: {date.toLocaleString()}</Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
      <PrimaryButton onPress={handleSubmit}>Create Shift</PrimaryButton>
    </KeyboardAvoidingView>
  );
};

export default AdvertCreateFormScreen;

const styles = StyleSheet.create({});
