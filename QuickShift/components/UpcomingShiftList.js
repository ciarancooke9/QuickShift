import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { auth } from "../utils/firebaseUtils";
import { useNavigation } from "@react-navigation/native";

import SecondaryButton from "./ui/SecondaryButton";

const UpcomingShiftList = ({ upcomingShiftsList }) => {
  const [showOpenAdverts, setShowOpenAdverts] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const adverts = upcomingShiftsList;
  const navigation = useNavigation();

  const handleAdvertListPress = () => {
    setShowOpenAdverts(!showOpenAdverts);
  };

  const chatPress = async (event, users) => {
    event.preventDefault();
    //const advert = adverts.find((item) => item.id === selectedId);
    navigation.navigate("Chat", {
      screen: "ChatScreen",
      advertId: selectedId,
      employer: users.employer,
      employee: users.employee,
      currentUser: auth.currentUser.uid,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <View>
          <TouchableOpacity onPress={handleAdvertListPress}>
            <View style={styles.advertListHeader}>
              <Text style={styles.advertListHeaderText}>
                Your upcoming Shifts
              </Text>
            </View>
          </TouchableOpacity>
          {showOpenAdverts && (
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
                    <SecondaryButton
                      onPress={(event) =>
                        chatPress(event, {
                          employee: item.employee,
                          employer: item.employer,
                        })
                      }
                    >
                      Chat
                    </SecondaryButton>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  console.log("upcominglist", upcomingShiftsList);
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

export default UpcomingShiftList;

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
