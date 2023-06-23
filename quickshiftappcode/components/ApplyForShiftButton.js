import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "./ui/PrimaryButton";
import React from "react";

const ApplyForShiftButton = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const advertsDb = collection(db, "adverts");
      addDoc(advertsDb, {
        location: employerDetails.location,
        address: employerDetails.address,
        employer: employerDetails.businessName,
        type: selected,
        hours: advert.hours,
        time: { date: timeDate[0], startTime: timeDate[1] },
        pay: advert.pay,
      });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("advert creation encountered an error", error);
      }
    }
  };

  return (
    <View>
      <PrimaryButton onPress={applyForShift}>Apply</PrimaryButton>
    </View>
  );
};

export default ApplyForShiftButton;

const styles = StyleSheet.create({});
