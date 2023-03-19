import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

import OpenShiftsList from "./OpenShiftsList";
import AppliedShiftsList from "./AppliedShiftsList";
import UpcomingShiftList from "./UpcomingShiftList";

const AdvertsList = ({ employeeDetails }) => {
  const [adverts, setAdverts] = useState([]);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log("advertlistload", employeeDetails);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);

      const fetchUpcomingShifts = async () => {
        const q = query(
          collection(db, "adverts"),
          where("employee", "==", auth.currentUser.uid)
        );

        try {
          onSnapshot(q, (snapshot) => {
            let upcomingShiftList = [];
            snapshot.docs.map((doc) =>
              upcomingShiftList.push({ ...doc.data(), id: doc.id })
            );
            setUpcomingShifts(upcomingShiftList);
          });
        } catch (e) {
          // Handle error
        }
      };
      const fetchAdvert = async () => {
        console.log("advertlist", employeeDetails.experience);
        const q = query(
          collection(db, "adverts"),
          where("type", "in", employeeDetails.experience),
          where("active", "==", true)
        );

        try {
          onSnapshot(q, (snapshot) => {
            let advertList = [];
            snapshot.docs.map((doc) =>
              advertList.push({ ...doc.data(), id: doc.id })
            );
            setAdverts(advertList);
          });
        } catch (e) {
          // Handle error
        }
      };

      fetchAdvert();
      fetchUpcomingShifts();
      setLoading(false);
      console.log("adverts", adverts);
      return () => {};
    }, [employeeDetails])
  );

  return (
    <View>
      {adverts.length > 0 && (
        <View>
          <OpenShiftsList
            openShiftsList={adverts}
            employeeDetails={employeeDetails}
          />
          <AppliedShiftsList
            appliedShiftsList={adverts}
            employeeDetails={employeeDetails}
          />
        </View>
      )}
      <UpcomingShiftList upcomingShiftsList={upcomingShifts} />
    </View>
  );
};

export default AdvertsList;

const styles = StyleSheet.create({
  advertListHeader: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  advertListHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  advertItem: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  advertTitle: {
    fontSize: 16,
  },
});
