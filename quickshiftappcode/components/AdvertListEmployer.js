import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import SecondaryButton from "./ui/SecondaryButton";
import UpcomingShiftList from "./UpcomingShiftList";
import separateOldObjects from "../JSfunctions/seperateOldShifts";
import OldShiftList from "./OldShiftsList";
import PendingShifts from "./PendingShifts";
import Card from "./ui/AdvertCard";

const AdvertListEmployer = ({ employerDetails, navigation }) => {
  const [adverts, setAdverts] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [pendingShifts, setPendingShifts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [oldShifts, setOldShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdverts, setShowAdverts] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);

      const fetchAdvert = async () => {
        const q = query(
          collection(db, "adverts"),
          where("employer", "==", auth.currentUser.uid)
        );

        try {
          onSnapshot(q, (snapshot) => {
            let advertList = [];
            snapshot.docs.map((doc) =>
              advertList.push({ ...doc.data(), id: doc.id })
            );
            setAdverts(advertList);
            setLoading(false);
            filterUpcomingShifts(advertList);
            filterPendingShifts(advertList);
          });
        } catch (e) {
          // Handle error
        }
      };

      fetchAdvert();

      return () => {
        setLoading(false);
      };
    }, [employerDetails])
  );

  const filterUpcomingShifts = (adverts) => {
    const filteredAdverts = adverts.filter((advert) => {
      return advert.active === false;
    });
    const seperatedList = separateOldObjects(filteredAdverts);
    setUpcomingShifts(seperatedList.newObjects);
    setOldShifts(seperatedList.oldObjects);
  };
  const filterPendingShifts = (adverts) => {
    const filteredAdverts = adverts.filter((advert) => {
      return advert.active === true;
    });
    setPendingShifts(filteredAdverts);
  };

  const handleViewApplicants = async (item) => {
    try {
      navigation.navigate("ViewApplicants", {
        screen: "ViewApplicantsScreen",
        advert: item,
        employerDetails: employerDetails,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdvertListPress = () => {
    setShowAdverts(!showAdverts);
  };

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

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(selectedId === item.id ? null : item.id)}
      >
        <View style={{ padding: 6 }}>
          <Text
            style={[
              styles.advertTime,
              selectedId === item.id && styles.advertTimeSelected,
            ]}
          >
            {item.time.date}
          </Text>
          {selectedId === item.id && (
            <View style={styles.advertItem}>
              <Text>Address: {item.address}</Text>
              <Text>Pay: {item.pay}</Text>
              <Text>Time: {item.time.startTime}</Text>
              <Text>Applicants: {JSON.stringify(item.applicants.length)}</Text>
              <SecondaryButton onPress={() => handleViewApplicants(item)}>
                View Applicants
              </SecondaryButton>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <TouchableOpacity onPress={() => handleComponentPress("pendingShifts")}>
        <View
          style={
            selectedComponent === "pendingShifts" || selectedComponent === null
              ? styles.selectedComponent
              : styles.unselectedComponent
          }
        >
          <PendingShifts
            pendingShifts={pendingShifts}
            showAdverts={selectedComponent}
            handleClose={handleClose}
            employerDetails={employerDetails}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleComponentPress("upcomingShifts")}>
        <View
          style={
            selectedComponent === "upcomingShifts" || selectedComponent === null
              ? styles.selectedComponent
              : styles.unselectedComponent
          }
        >
          <UpcomingShiftList
            upcomingShiftsList={upcomingShifts}
            showAdverts={selectedComponent}
            handleClose={handleClose}
            employer={true}
          />
        </View>
      </TouchableOpacity>
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
            employer={true}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AdvertListEmployer;

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContainer: { padding: 20, borderBottomWidth: 1 },
  advertListHeader: {
    backgroundColor: "#778899",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  advertListHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  advertItem: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 20,
  },
  advertTitle: {
    fontSize: 16,
  },
  advertTime: {
    fontSize: 16,
    backgroundColor: "#b3b3b3",
    borderRadius: 10,
    padding: 4,
  },
  advertTimeSelected: {
    fontSize: 20,
    fontStyle: "italic",
    backgroundColor: "#b3b3b3",
    borderRadius: 10,
    padding: 4,
  },
  selectedComponent: {
    display: "flex",
  },
  unselectedComponent: {
    display: "none",
  },
});
