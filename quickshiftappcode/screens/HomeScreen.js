import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useState, useCallback } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { useFocusEffect } from "@react-navigation/native";
import { isEmpty } from "lodash";
import { doc, getDoc } from "firebase/firestore";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      const fetchEmployee = async () => {
        const docRef = doc(db, "users", auth.currentUser.uid);

        try {
          const docSnap = await getDoc(docRef);
          console.log(docSnap.data());
          setUser(docSnap.data());
          setLoading(false);
        } catch (e) {
          console.log(e);
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
      if (!auth.currentUser) {
        navigation.replace("Welcome", {});
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
