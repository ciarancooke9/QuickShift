import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { auth } from "../utils/firebaseUtils";
import { useNavigation } from "@react-navigation/native";
import Card from "./ui/AdvertCard";

import SecondaryButton from "./ui/SecondaryButton";
import PrimaryButton from "./ui/PrimaryButton";

const UpcomingShiftList = ({
  upcomingShiftsList,
  showAdverts,
  handleClose,
  employer,
}) => {
  const [showOpenAdverts, setShowOpenAdverts] = useState(
    showAdverts === "upcomingShifts"
  );
  const [selectedId, setSelectedId] = useState(null);
  const adverts = upcomingShiftsList;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setShowOpenAdverts(showAdverts === "upcomingShifts");
    }, [showAdverts])
  );

  const handlePressClose = () => {
    setShowOpenAdverts(false);
    handleClose(); // call the prop function to update the parent state
  };

  const chatPress = async (event, users) => {
    event.preventDefault();
    //const advert = adverts.find((item) => item.id === selectedId);
    navigation.navigate("Chat", {
      screen: "ChatScreen",
      advertId: selectedId,
      employer: users.employer,
      employee: users.employee,
      employerName: users.employerName,
      employeeName: users.employeeName,
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
                <Text style={{ fontSize: 16 }}>{item.time.date}</Text>
                {selectedId === item.id && (
                  <View style={{ padding: 6 }}>
                    <Card data={item} />
                    <PrimaryButton
                      onPress={(event) =>
                        chatPress(event, {
                          employee: item.employee,
                          employer: item.employer,
                          employeeName: item.employeeName,
                          employerName: item.employerName,
                        })
                      }
                    >
                      Chat
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
          Your Upcoming Shifts ({adverts.length})
        </Text>
      </View>

      <View
        style={{ height: showOpenAdverts ? "auto" : "auto", maxHeight: 600 }}
      >
        <FlatList
          style={{ height: showOpenAdverts ? 600 : "auto" }}
          data={adverts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
      {showOpenAdverts && (
        <View>
          <SecondaryButton onPress={handlePressClose}>Close</SecondaryButton>
        </View>
      )}
    </View>
  );
};

export default UpcomingShiftList;

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
  shiftButton: {
    margin: 6,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    padding: 5,
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
