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
import { async } from "@firebase/util";

const AdvertListEmployer = ({ employerDetails, navigation }) => {
  const [adverts, setAdverts] = useState([]);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  //console.log("AdvertListEmployer", employeeDetails);

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
            filterActiveisFalse(advertList);
          });
        } catch (e) {
          // Handle error
        }
      };

      fetchAdvert();

      console.log("advertlistemployer", upcomingShifts);

      return () => {
        setLoading(false);
      };
    }, [employerDetails])
  );

  const filterActiveisFalse = (adverts) => {
    const filteredAdverts = adverts.filter((advert) => {
      return advert.active === false;
    });
    setUpcomingShifts(filteredAdverts);
  };

  const handleViewApplicants = async (item) => {
    try {
      navigation.navigate("ViewApplicants", {
        screen: "ViewApplicantsScreen",
        advert: item,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(selectedId === item.id ? null : item.id)}
      >
        <View style={{ padding: 6 }}>
          <Text>{item.employerName}</Text>
          {selectedId === item.id && (
            <View style={{ padding: 6 }}>
              <Text>Address: {item.address}</Text>
              <Text>Pay: {item.pay}</Text>
              <Text>Time: {item.time.startTime}</Text>
              <Text>Date: {item.time.date}</Text>
              <Text>Applicants: {JSON.stringify(item.applicants.length)}</Text>
              {item.applicants.includes(auth.currentUser.uid) ? (
                <Text>You have already applied to this advert</Text>
              ) : (
                <SecondaryButton onPress={() => handleViewApplicants(item)}>
                  View Applicants
                </SecondaryButton>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList
        data={adverts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <UpcomingShiftList upcomingShiftsList={upcomingShifts} />
    </View>
  );
};

export default AdvertListEmployer;

const styles = StyleSheet.create({});
