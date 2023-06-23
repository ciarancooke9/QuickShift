import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import SecondaryButton from "./ui/SecondaryButton";
import Card from "./ui/AdvertCard";
import { useNavigation } from "@react-navigation/native";

const PendingShifts = ({
  pendingShifts,
  showAdverts,
  handleClose,
  employerDetails,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [showOpenAdverts, setShowOpenAdverts] = useState(
    showAdverts === "pendingShifts"
  );
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setShowOpenAdverts(showAdverts === "pendingShifts");
    }, [pendingShifts, showAdverts])
  );

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

  const handlePressClose = () => {
    setShowOpenAdverts(false);
    handleClose(); // call the prop function to update the parent state
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
    <View style={styles.listContainer}>
      <View style={styles.advertListHeader}>
        <Text style={styles.advertListHeaderText}>
          Pending Shifts ({pendingShifts.length})
        </Text>
      </View>

      {showOpenAdverts && (
        <View style={{ height: 600 }}>
          <FlatList
            style={{
              height: 600,
              maxHeight: 600,
            }}
            data={pendingShifts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
          <SecondaryButton onPress={handlePressClose}>Close</SecondaryButton>
        </View>
      )}
    </View>
  );
};

export default PendingShifts;

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
});
