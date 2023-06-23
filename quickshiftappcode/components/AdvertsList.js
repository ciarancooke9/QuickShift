import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import * as geofire from "geofire-common";
import { debounce } from "lodash";
import OpenShiftsList from "./OpenShiftsList";
import AppliedShiftsList from "./AppliedShiftsList";
import UpcomingShiftList from "./UpcomingShiftList";
import OldShiftList from "./OldShiftsList";
import separateOldObjects from "../JSfunctions/seperateOldShifts";

const AdvertsList = ({ employeeDetails }) => {
  //pass state back up to this component and use current code
  const [adverts, setAdverts] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [appliedShifts, setAppliedShifts] = useState([]);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [oldShifts, setOldShifts] = useState([]);
  const km = 100; //kilometers
  const meters = 1000;
  const [searchRadius, setSearchRadius] = useState(km);
  const [radiusInM, setradiusInM] = useState(km * meters);
  const [loading, setLoading] = useState(false);
  let bounds = null;

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const userLocationSearch = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
        }
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        console.log("fetch user coords", [
          location.coords.latitude,
          location.coords.longitude,
        ]);
        const userLocation = [
          location.coords.latitude,
          location.coords.longitude,
        ];
        bounds = geofire.geohashQueryBounds(userLocation, radiusInM);
        fetchAdvert(userLocation);
      };

      const fetchUpcomingShifts = async () => {
        const q = query(
          collection(db, "adverts"),
          where("employee", "==", auth.currentUser.uid)
        );

        try {
          onSnapshot(q, (snapshot) => {
            let shiftList = [];
            snapshot.docs.map((doc) =>
              shiftList.push({ ...doc.data(), id: doc.id })
            );

            const seperatedList = separateOldObjects(shiftList);

            setUpcomingShifts(seperatedList.newObjects);
            setOldShifts(seperatedList.oldObjects);
          });
        } catch (e) {
          // Handle error
        }
      };

      const fetchAdvert = async (userlocation) => {
        const q = query(
          collection(db, "adverts"),
          where("type", "in", employeeDetails.experience),
          where("active", "==", true)
        );

        try {
          onSnapshot(q, (snapshot) => {
            let advertList = [];
            let appliedShiftsList = [];
            snapshot.docs.map((doc) => {
              const { latitude, longitude } = doc.data().geopoint;
              const distanceInKm = geofire.distanceBetween(
                [latitude, longitude],
                userlocation
              );
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= searchRadius * meters) {
                advertList.push({ ...doc.data(), id: doc.id });
              }
              appliedShiftsList.push({ ...doc.data(), id: doc.id });
            });
            console.log("openshifts", advertList);
            setAdverts(advertList);
            setAppliedShifts(appliedShiftsList);
          });
        } catch (e) {
          // Handle error
        }
      };

      userLocationSearch();
      fetchUpcomingShifts();
      setLoading(false);
      return () => {};
    }, [employeeDetails, searchRadius])
  );

  const handleSearchRadiusChange = debounce((value) => {
    setSearchRadius(parseInt(value));
  }, 500);

  const handleComponentPress = (component) => {
    if (selectedComponent === component) {
      setSelectedComponent(null);
    } else {
      setSelectedComponent(component);
    }
  };

  const handleClose = () => {
    setSelectedComponent(null);
  };

  return (
    <View>
      {adverts ? (
        <View>
          <View
            style={
              selectedComponent === "openShifts" || selectedComponent === null
                ? styles.selectedComponent
                : styles.unselectedComponent
            }
          >
            <TextInput
              style={styles.inputField}
              keyboardType="numeric"
              placeholder="Enter search radius in km"
              value={searchRadius}
              onChangeText={handleSearchRadiusChange}
            />
          </View>
          <TouchableOpacity onPress={() => handleComponentPress("openShifts")}>
            <View
              style={
                selectedComponent === "openShifts" || selectedComponent === null
                  ? styles.selectedComponent
                  : styles.unselectedComponent
              }
            >
              <OpenShiftsList
                openShiftsList={adverts}
                employeeDetails={employeeDetails}
                showAdverts={selectedComponent}
                handleClose={handleClose}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.heading}>No Shifts Available</Text>
      )}
      {appliedShifts ? (
        <TouchableOpacity onPress={() => handleComponentPress("appliedShifts")}>
          <View
            style={
              selectedComponent === "appliedShifts" ||
              selectedComponent === null
                ? styles.selectedComponent
                : styles.unselectedComponent
            }
          >
            <AppliedShiftsList
              appliedShiftsList={appliedShifts}
              employeeDetails={employeeDetails}
              showAdverts={selectedComponent}
              handleClose={handleClose}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={styles.heading}>You didn't apply to any shifts</Text>
      )}
      {upcomingShifts ? (
        <TouchableOpacity
          onPress={() => handleComponentPress("upcomingShifts")}
        >
          <View
            style={
              selectedComponent === "upcomingShifts" ||
              selectedComponent === null
                ? styles.selectedComponent
                : styles.unselectedComponent
            }
          >
            <UpcomingShiftList
              upcomingShiftsList={upcomingShifts}
              showAdverts={selectedComponent}
              handleClose={handleClose}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={styles.heading}>No Upcoming Shifts</Text>
      )}
      {oldShifts ? (
        <TouchableOpacity onPress={() => handleComponentPress("oldShifts")}>
          <View
            style={
              selectedComponent === "oldShifts" || selectedComponent === null
                ? styles.selectedComponent
                : styles.unselectedComponent
            }
          >
            <OldShiftList
              oldShiftsList={oldShifts}
              showAdverts={selectedComponent}
              handleClose={handleClose}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={styles.heading}>No Past Shifts</Text>
      )}
    </View>
  );
};

export default AdvertsList;

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
    padding: 20,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  selectedComponent: {
    display: "flex",
  },
  unselectedComponent: {
    display: "none",
  },
});
