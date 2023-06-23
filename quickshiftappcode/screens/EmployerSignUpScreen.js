import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import messaging from "@react-native-firebase/messaging";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../utils/firebaseUtils";
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLEAPIKEY } from "../utils/googleAPI";
import React, { useState, useCallback } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";

const EmployerSignupScreen = ({ navigation }) => {
  const [fcmToken, setfcmToken] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [employer, setEmployer] = useState({
    businessType: "",
    businessName: "",
    location: "",
    description: "",
    address: "",
    businessPlaceID: "",
  });

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
  useFocusEffect(
    useCallback(() => {
      messaging()
        .getToken()
        .then((token) => {
          setfcmToken(token);
          console.log("signup fcm token", token);
        });
      userLocation();
      return () => {};
    }, [])
  );

  const handleSubmit = async (event) => {
    console.log("button hit");
    event.preventDefault();

    try {
      const userDb = collection(db, "Employers");
      addDoc(userDb, {
        location: employer.location,
        description: employer.description,
        address: employer.address,
        businessName: employer.businessName,
        businessType: employer.businessType,
        trustFactor: 7,
        favorites: [],
        businessPlaceID: employer.businessPlaceID,
        email: auth.currentUser.email,
        userID: auth.currentUser.uid,
        geopoint: new GeoPoint(markerCoords.latitude, markerCoords.longitude),
        fcmToken: fcmToken,
      });
      navigation.replace("Home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };
  const handleMapOpen = () => {
    setShowMap(!showMap);
  };
  const handleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleMapPress = (event) => {
    setMarkerCoords(event.nativeEvent.coordinate);
    console.log("employersignup marker coords", markerCoords);
  };

  const handleMarkerDragEnd = (event) => {
    setMarkerCoords(event.nativeEvent.coordinate);
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
                title="Place this Marker where your business is?"
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            )}
          </MapView>
          <SecondaryButton style={styles.mapButton} onPress={userLocation}>
            Use Current Location
          </SecondaryButton>
          <SecondaryButton style={styles.mapButton} onPress={handleMapOpen}>
            Use This Location
          </SecondaryButton>
        </View>
      )}
      {!showMap && (
        <KeyboardAvoidingView style={styles.formContainer}>
          <View>
            <Text style={styles.heading}>Enter Your Business Name</Text>
            <TextInput
              style={styles.input}
              placeholder="O'Sheas"
              value={employer.businessName}
              onChangeText={(text) =>
                setEmployer({ ...employer, businessName: text })
              }
            ></TextInput>
            <Text style={styles.heading}>Enter your Business type</Text>
            <TextInput
              style={styles.input}
              placeholder="Bar"
              value={employer.businessType}
              onChangeText={(text) =>
                setEmployer({ ...employer, businessType: text })
              }
            ></TextInput>
            <Text style={styles.heading}>
              Enter a brief business description
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={employer.description}
              onChangeText={(text) =>
                setEmployer({ ...employer, description: text })
              }
            ></TextInput>
            <Text style={styles.heading}>Choose your Region</Text>
            <TextInput
              style={styles.input}
              placeholder="Cavan"
              value={employer.location}
              onChangeText={(text) =>
                setEmployer({ ...employer, location: text })
              }
            ></TextInput>
            <Text style={styles.heading}>Enter your business address</Text>
            <SecondaryButton onPress={handleSearch}>
              Search for your address/business
            </SecondaryButton>
            {showSearch && (
              <View>
                <GooglePlacesAutocomplete
                  style={styles.input}
                  placeholder="Search"
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log("places", data, details);
                    setEmployer({
                      ...employer,
                      address: data.description,
                      businessPlaceID: data.place_id,
                    });
                    handleSearch();
                  }}
                  query={{
                    key: GOOGLEAPIKEY,
                    language: "en",
                  }}
                />
                <SecondaryButton onPress={handleSearch}>Close</SecondaryButton>
              </View>
            )}
            <Text style={styles.addressText}>Address: {employer.address}</Text>

            <Text style={styles.helpMessage}>
              The map marker will be set to your current location, if this is
              not your business location please move the marker to it on the map
            </Text>
            <SecondaryButton onPress={handleMapOpen}>
              Choose your location
            </SecondaryButton>
          </View>

          <PrimaryButton onPress={handleSubmit}>Register</PrimaryButton>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default EmployerSignupScreen;

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
  addressText: {
    fontSize: 16,
    color: "#777",
    fontWeight: "bold",
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
