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
import { useFocusEffect } from "@react-navigation/native";

const AdvertsList = ({ employeeDetails }) => {
  const [adverts, setAdverts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  //console.log("advertslist", employeeDetails);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);

      const fetchAdvert = async () => {
        const q = query(
          collection(db, "adverts"),
          where("type", "in", employeeDetails.experience)
        );

        try {
          onSnapshot(q, (snapshot) => {
            let advertList = [];
            snapshot.docs.map((doc) =>
              advertList.push({ ...doc.data(), id: doc.id })
            );
            setAdverts(advertList);
            setLoading(false);
          });
          /* const querySnapshot = await getDocs(q);
          const queryResults = querySnapshot.docs.map((doc) => doc.data());
          console.log("advertdbcall", queryResults);
          setAdverts(queryResults);
          setLoading(false); */
        } catch (e) {
          // Handle error
        }
      };

      fetchAdvert();

      return () => {
        setLoading(false);
      };
    }, [employeeDetails])
  );

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
