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
import Card from "./ui/AdvertCard";

const AppliedShiftsList = ({
  appliedShiftsList,
  employeeDetails,
  showAdverts,
  handleClose,
}) => {
  const [showOpenAdverts, setShowOpenAdverts] = useState(
    showAdverts === "appliedShifts"
  );
  const [adverts, setAdverts] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      filterAdvertsByUser(auth.currentUser.uid, appliedShiftsList);
      setShowOpenAdverts(showAdverts === "appliedShifts");
    }, [appliedShiftsList, showAdverts])
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
    setShowOpenAdverts(!showOpenAdverts);
  };

  const handlePressClose = () => {
    setShowOpenAdverts(false);
    handleClose(); // call the prop function to update the parent state
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <View>
          {showOpenAdverts && (
            <TouchableOpacity
              onPress={() =>
                setSelectedId(selectedId === item.id ? null : item.id)
              }
            >
              <View style={styles.shiftButton}>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}
                >
                  {item.employerName}
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {item.time.date} {item.time.startTime}
                </Text>

                {selectedId === item.id && (
                  <View style={{ padding: 6 }}>
                    <Card data={item} />
                    {item.applicants.includes(auth.currentUser.uid) && (
                      <Text>You have already applied to this advert</Text>
                    )}
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
    <View style={styles.listContainer}>
      <View style={styles.advertListHeader}>
        <Text style={styles.advertListHeaderText}>
          Applied Shifts ({adverts?.length})
        </Text>
      </View>

      <View
        style={{ height: showOpenAdverts ? "auto" : "auto", maxHeight: 650 }}
      >
        <FlatList
          style={{ height: showOpenAdverts ? 650 : "auto" }}
          data={adverts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
        {showOpenAdverts && (
          <View>
            <SecondaryButton onPress={handlePressClose}>Close</SecondaryButton>
          </View>
        )}
      </View>
    </View>
  );
};

export default AppliedShiftsList;

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
  },
  shiftButton: {
    margin: 6,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    padding: 5,
  },
  advertTitle: {
    fontSize: 16,
  },
});
