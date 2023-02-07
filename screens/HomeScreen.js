import { StyleSheet, ActivityIndicator, View } from "react-native";
import React, { useState } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { useFocusEffect } from "@react-navigation/native";
import { isEmpty } from "lodash";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  /*   const dBCall = async () => {
    setLoading(true);
    const docRef = doc(db, "users", auth.currentUser.uid);
    
    console.log("homedocsnapdata", docSnap.data());
    setUser(docSnap.data());
    setLoading(false);
  };

  useEffect(() => {
    dBCall();
  }, []); */

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);

      const fetchEmployee = async () => {
        const docRef = doc(db, "users", auth.currentUser.uid);

        try {
          const docSnap = await getDoc(docRef);
          setUser(docSnap.data());
          setLoading(false);
        } catch (e) {
          // Handle error
        }
      };

      fetchEmployee();
      if (!isEmpty(user)) {
        console.log(user);
        if (user.isEmployer) {
          navigation.replace("EmployerHome", {
            userDetails: user,
          });
        } else {
          navigation.replace("EmployeeHome", {
            userDetails: user,
          });
        }
      }

      return () => {
        setLoading(false);
      };
    }, [user])
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (user.isEmployer) {
        navigation.replace("EmployerHome", {
          userDetails: user,
        });
      } else {
        navigation.replace("EmployeeHome", {
          userDetails: user,
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <ActivityIndicator />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
  },
});
