import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../utils/firebaseUtils";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import SecondaryButton from "./ui/SecondaryButton";

const AppliedShiftsList = ({ appliedShiftsList, employeeDetails }) => {
  const [showAppliedAdverts, setShowAppliedAdverts] = useState(false);
  const [adverts, setAdverts] = useState();
  const [selectedId, setSelectedId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      filterAdvertsByUser(auth.currentUser.uid, appliedShiftsList);
    }, [appliedShiftsList])
  );

  const handleApply = async (event) => {
    event.preventDefault();

    try {
      const docRef = doc(db, "adverts", selectedId);
      await updateDoc(docRef, {
        applicants: arrayUnion(employeeDetails),
      });
      setSelectedId(null);

      alert("You have applied successfully!");
      // Remove selected advert from adverts array
      setAdverts(adverts.filter((advert) => advert.id !== selectedId));
    } catch (error) {
      console.log(error);
    }
  };

  const filterAdvertsByUser = (currentUserUid, appliedShiftsList) => {
    const filteredAdverts = appliedShiftsList.filter((advert) => {
      const appliedUserIDs = advert.applicants.map(
        (applicant) => applicant.userID
      );
      return appliedUserIDs.includes(currentUserUid);
    });
    setAdverts(filteredAdverts);
  };

  const handleAdvertListPress = () => {
    setShowAppliedAdverts(!showAppliedAdverts);
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <View>
          <TouchableOpacity onPress={handleAdvertListPress}>
            <View style={styles.advertListHeader}>
              <Text style={styles.advertListHeaderText}>Applied Shifts</Text>
            </View>
          </TouchableOpacity>
          {showAppliedAdverts && (
            <TouchableOpacity
              onPress={() =>
                setSelectedId(selectedId === item.id ? null : item.id)
              }
            >
              <View style={{ padding: 6 }}>
                <Text>{item.employerName}</Text>
                {selectedId === item.id && (
                  <View style={{ padding: 6 }}>
                    <Text>Address: {item.address}</Text>
                    <Text>Pay: {item.pay}</Text>
                    <Text>Time: {item.time.startTime}</Text>
                    <Text>Date: {item.time.date}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        data={adverts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AppliedShiftsList;

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
