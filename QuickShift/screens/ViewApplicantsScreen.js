import { StyleSheet, Text, View, FlatList } from "react-native";
import SecondaryButton from "../components/ui/SecondaryButton";
import React from "react";
import { db } from "../utils/firebaseUtils";
import { updateDoc, doc } from "firebase/firestore";

const ViewApplicantsScreen = ({ route, navigation }) => {
  const advert = route.params.advert;
  const applicants = advert.applicants;

  const handleAccept = async (applicant) => {
    console.log("apply button", applicant);
    try {
      const docRef = doc(db, "adverts", advert.id);
      await updateDoc(docRef, {
        employee: applicant.userID,
        active: false,
      });
      alert("You have chosen an employee for this shift!");
      navigation.replace("EmployerHome");
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <View style={{ padding: 6 }}>
          <Text>Name: {item.fullName}</Text>
          <Text>Experience: {item.experience}</Text>
          <Text>TrustFactor: {item.trustFactor}</Text>
          <Text>About: {item.description}</Text>
          <SecondaryButton onPress={() => handleAccept(item)}>
            Accept Employee
          </SecondaryButton>
        </View>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        data={applicants}
        keyExtractor={(item) => item.userID}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ViewApplicantsScreen;

const styles = StyleSheet.create({});
