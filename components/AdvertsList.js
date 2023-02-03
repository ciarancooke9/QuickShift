import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseUtils";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const AdvertsList = ({ employeeDetails }) => {
  const [adverts, setAdverts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log("advertslist", employeeDetails);
  const advertDBCall = async () => {
    console.log("advertdbcall", employeeDetails.experience);

    const q = query(
      collection(db, "adverts"),
      where("type", "in", employeeDetails.experience)
    );

    const querySnapshot = await getDocs(q);
    const queryResults = querySnapshot.docs.map((doc) => doc.data());
    setAdverts(queryResults);
  };

  useEffect(() => {
    advertDBCall();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(selectedId === item.id ? null : item.id)}
      >
        <View style={{ padding: 6 }}>
          <Text>{item.employer}</Text>
          {selectedId === item.id && (
            <View style={{ padding: 6 }}>
              <Text>Address: {item.address}</Text>
              <Text>Pay: {item.pay}</Text>
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
    </View>
  );
};

export default AdvertsList;

const styles = StyleSheet.create({});
