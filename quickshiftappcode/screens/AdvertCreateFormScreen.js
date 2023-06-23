import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { auth } from "../utils/firebaseUtils";
import { Timestamp, GeoPoint } from "firebase/firestore";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import {
  DateTimePickerAndroid,
  DateTimePicker,
} from "@react-native-community/datetimepicker";

const AdvertCreateFormScreen = ({ route, navigation }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const employerDetails = route.params.employer;
  const [geopoint, setGeoPoint] = useState(employerDetails.geopoint);
  const [showMap, setShowMap] = useState(false);
  const [jobObject, setJobObject] = useState(null);
  const [selected, setSelected] = useState("");
  const [markerCoords, setMarkerCoords] = useState({
    latitude: geopoint.latitude,
    longitude: geopoint.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: geopoint.latitude,
    longitude: geopoint.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useFocusEffect(
    useCallback(() => {
      if (jobObject) {
        navigation.navigate("Checkout", {
          screen: "CheckoutScreen",
          advert: jobObject,
        });
      }
      return () => {};
    }, [jobObject, navigation])
  );

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarkerCoords({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleMapOpen = () => {
    setShowMap(!showMap);
  };

  const handleMapPress = (event) => {
    setMarkerCoords(event.nativeEvent.coordinate);
    console.log("employersignup marker coords", markerCoords);
    setGeoPoint(event.nativeEvent.coordinate);
  };

  const handleMarkerDragEnd = (event) => {
    setMarkerCoords(event.nativeEvent.coordinate);
    setGeoPoint(event.nativeEvent.coordinate);
  };
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
    "Retail",
    "Laboring",
    "Carpentry",
    "Plumbing",
    "Roofing",
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
    const dateTime = dateString.split(" ").filter(Boolean); // <-- add filter here
    console.log("dateextractor", dateTime);
    return dateTime;
  };

  const toFirestoreTimestamp = (dateArray) => {
    const dateStr = `${dateArray[0]} ${dateArray[1]} ${dateArray[2]} ${dateArray[3]} ${dateArray[4]}`;
    const timestamp = Date.parse(dateStr);
    return new Timestamp.fromDate(new Date(timestamp));
  };
  console.log("advert form", dateExtractor(date));
  console.log(
    "advert form timestamp",
    toFirestoreTimestamp(dateExtractor(date))
  );
  const createAdvert = () => {
    const timeDate = dateExtractor(date);

    const shiftTimeServer = toFirestoreTimestamp(timeDate);
    setJobObject({
      location: employerDetails.location,
      address: employerDetails.address,
      employerName: employerDetails.businessName,
      employer: auth.currentUser.uid,
      type: selected,
      hours: advert.hours,
      time: {
        date: `${timeDate[0]} ${timeDate[2]} ${timeDate[1]} ${timeDate[4]}`,
        startTime: timeDate[3],
      },
      timeServer: shiftTimeServer,
      geopoint: new GeoPoint(geopoint.latitude, geopoint.longitude),
      placeID: employerDetails.businessPlaceID,
      pay: advert.pay,
      applicants: [],
      employee: null,
      active: true,
    });
  };

  return (
    <View style={styles.screen}>
      {showMap && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
            onPress={handleMapPress}
          >
            {markerCoords && (
              <Marker
                coordinate={markerCoords}
                title="Place this Marker at the shift location?"
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            )}
          </MapView>
          <SecondaryButton style={styles.mapButton} onPress={userLocation}>
            Use Current Location
          </SecondaryButton>
          <SecondaryButton style={styles.mapButton} onPress={handleMapOpen}>
            Choose Location
          </SecondaryButton>
        </View>
      )}
      {!showMap && (
        <KeyboardAvoidingView style={styles.formContainer}>
          <View>
            <Text style={styles.heading}>Enter shift length in hours</Text>
            <TextInput
              placeholder="hours"
              value={advert.hours}
              onChangeText={(text) => setAdvert({ ...advert, hours: text })}
              keyboardType="numeric"
              style={styles.input}
            ></TextInput>
            <Text style={styles.heading}>Enter Hourly Rate</Text>
            <TextInput
              style={styles.input}
              placeholder="pay"
              value={advert.pay}
              onChangeText={(text) => setAdvert({ ...advert, pay: text })}
              keyboardType="numeric"
            ></TextInput>
            <Text style={styles.heading}>
              Select the type of work expected to be completed during the shift
            </Text>
            <SelectList
              setSelected={(val) => setSelected(val)}
              data={type}
              value={type}
              save="value"
              label="Categories"
            />
          </View>
          <View>
            <Text style={styles.heading}>Enter shift start time</Text>
            <View style={styles.buttonContainer}>
              <SecondaryButton onPress={showDatepicker} style={styles.button}>
                <Text style={styles.buttonText}>Pick Date</Text>
              </SecondaryButton>
              <SecondaryButton onPress={showTimepicker} style={styles.button}>
                <Text style={styles.buttonText}>Pick Time</Text>
              </SecondaryButton>
            </View>
            <Text style={styles.heading}>{date.toLocaleString()}</Text>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
              />
            )}
          </View>
          <Text style={styles.helpMessage}>
            If this shift is not at the location selected during signup please
            place pin at new location
          </Text>
          <SecondaryButton onPress={handleMapOpen}>
            Shift Location
          </SecondaryButton>
          <View style={styles.submitButtonContainer}>
            <PrimaryButton onPress={createAdvert}>Checkout $18</PrimaryButton>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default AdvertCreateFormScreen;

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: "center",
    flex: 2,
    alignItems: "center",
  },
  screen: {
    flex: 1,
  },
  mapButton: { flex: 1 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  submitButtonContainer: {
    borderRadius: 5,
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#008080",
  },
  mapContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  helpMessage: {
    fontSize: 16,
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333333",
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 10,
  },
});
