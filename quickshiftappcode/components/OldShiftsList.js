import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../utils/firebaseUtils";
import { useNavigation } from "@react-navigation/native";
import Card from "./ui/AdvertCard";

import SecondaryButton from "./ui/SecondaryButton";
import PrimaryButton from "./ui/PrimaryButton";

const OldShiftList = ({
  oldShiftsList,
  showAdverts,
  handleClose,
  employer,
}) => {
  const [showOpenAdverts, setShowOpenAdverts] = useState(
    showAdverts === "oldShifts"
  );
  const [selectedId, setSelectedId] = useState(null);
  const adverts = oldShiftsList;
  const navigation = useNavigation();

  const handleAdvertListPress = () => {
    setShowOpenAdverts(!showOpenAdverts);
  };

  const handlePressClose = () => {
    setShowOpenAdverts(false);
    handleClose(); // call the prop function to update the parent state
  };

  useFocusEffect(
    useCallback(() => {
      setShowOpenAdverts(showAdverts === "oldShifts");
    }, [showAdverts])
  );

  const reviewPress = async (event, shiftinfo) => {
    console.log("oldList", auth.currentUser);
    event.preventDefault();
    //const advert = adverts.find((item) => item.id === selectedId);
    navigation.navigate("Review", {
      screen: "ReviewScreen",
      shift: shiftinfo.shiftDetails,
      employer: shiftinfo.employer,
      employee: shiftinfo.employee,
      currentUser: auth.currentUser.uid,
    });
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
                    <PrimaryButton
                      onPress={(event) =>
                        reviewPress(event, {
                          employee: item.employee,
                          employer: item.employer,
                          shiftDetails: item,
                        })
                      }
                    >
                      Leave Review
                    </PrimaryButton>
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
          Old Shifts ({adverts.length})
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

        {showOpenAdverts && (
          <View>
            <SecondaryButton onPress={handlePressClose}>Close</SecondaryButton>
          </View>
        )}
      </View>
    </View>
  );
};

export default OldShiftList;

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
