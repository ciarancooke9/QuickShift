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
import PrimaryButton from "./ui/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import Card from "./ui/AdvertCard";

const OpenShiftsList = ({
  openShiftsList,
  employeeDetails,
  showAdverts,
  handleClose,
}) => {
  const [showOpenAdverts, setShowOpenAdverts] = useState(
    showAdverts === "openShifts"
  );
  const [adverts, setAdverts] = useState(openShiftsList);
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      filterAdvertsByUser(auth.currentUser.uid, openShiftsList);
      setShowOpenAdverts(showAdverts === "openShifts");
    }, [openShiftsList, showAdverts])
  );

  const handleMapOpen = async (adverts) => {
    try {
      navigation.navigate("Map", {
        screen: "MapScreen",
        adverts: adverts,
      });
    } catch (error) {
      console.log("handlemapopn", error);
    }
  };

  const handleApply = async (event) => {
    event.preventDefault();

    try {
      const docRef = doc(db, "adverts", selectedId);
      await updateDoc(docRef, {
        applicants: arrayUnion(employeeDetails),
      });
      setSelectedId(null);

      // Remove selected advert from adverts array
      setAdverts(adverts.filter((advert) => advert.id !== selectedId));

      alert("You have applied successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const filterAdvertsByUser = (currentUserUid, openShiftsList) => {
    const filteredAdverts = openShiftsList.filter((advert) => {
      const appliedUserIDs = advert.applicants.map(
        (applicant) => applicant.userID
      );
      return !appliedUserIDs.includes(currentUserUid);
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
                    {item.applicants.includes(auth.currentUser.uid) ? (
                      <Text>You have already applied to this advert</Text>
                    ) : (
                      <PrimaryButton onPress={handleApply}>Apply</PrimaryButton>
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
          Open Shifts ({adverts.length})
        </Text>
      </View>

      <View
        style={{ height: showOpenAdverts ? "auto" : "auto", maxHeight: 500 }}
      >
        <FlatList
          style={{ height: showOpenAdverts ? 500 : "auto" }}
          data={adverts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
      {showOpenAdverts && (
        <View>
          <SecondaryButton onPress={() => handleMapOpen(adverts)}>
            Open Adverts Map
          </SecondaryButton>
          <View>
            <SecondaryButton onPress={handlePressClose}>Close</SecondaryButton>
          </View>
        </View>
      )}
    </View>
  );
};

export default OpenShiftsList;

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
  advertTitle: {
    fontSize: 16,
  },
  shiftButton: {
    margin: 6,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    padding: 5,
  },
  closeButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
