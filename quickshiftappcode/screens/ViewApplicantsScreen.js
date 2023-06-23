import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Linking,
  Alert,
} from "react-native";
import SecondaryButton from "../components/ui/SecondaryButton";
import PrimaryButton from "../components/ui/PrimaryButton";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import storage from "@react-native-firebase/storage";
import { db } from "../utils/firebaseUtils";
import { updateDoc, doc } from "firebase/firestore";

const ViewApplicantsScreen = ({ route, navigation }) => {
  const advert = route.params.advert;
  const employerDetails = route.params.employerDetails;
  const [applicants, setApllicants] = useState(advert.applicants);
  const [certsPress, setCertsPress] = useState(false);
  const [imageURLs, setImageURLs] = useState({});

  useFocusEffect(
    useCallback(() => {
      const fetchImageURLs = async () => {
        const urls = {};
        for (const applicant of applicants) {
          console.log("userid", applicant.userID);
          try {
            const downloadURL = await storage()
              .ref(`images/${applicant.userID}.jpeg`)
              .getDownloadURL();
            urls[applicant.userID] = downloadURL;
          } catch (error) {
            console.log(
              "Error getting download URL for applicant",
              applicant.userID,
              error
            );
            urls[applicant.userID] = null; // set to null or default image
          }
        }
        setImageURLs(urls);
        console.log("imageurls", imageURLs);
      };
      fetchImageURLs();
    }, [applicants])
  );

  const handleAccept = async (applicant) => {
    console.log("apply button", applicant);
    try {
      const docRef = doc(db, "adverts", advert.id);
      await updateDoc(docRef, {
        employee: applicant.userID,
        employeeName: applicant.fullName,
        active: false,
      });
      alert("You have chosen an employee for this shift!");
      navigation.replace("EmployerHome");
    } catch (error) {
      console.log(error);
    }
  };
  const handleDownloadCV = async (applicant) => {
    try {
      const downloadURL = await storage()
        .ref(`files/${applicant.userID}/CV`)
        .getDownloadURL();
      Linking.openURL(downloadURL);
    } catch (error) {
      console.log(
        "Error getting download URL for applicant CV",
        applicant.userID,
        error
      );
    }
  };

  const handleDownloadAllFiles = async (applicant) => {
    setCertsPress(true);
    try {
      const files = await storage()
        .ref(`files/${applicant.userID}/certs`)
        .listAll();

      const downloadPromises = files.items.map((fileRef) => {
        return fileRef.getDownloadURL();
      });

      const downloadURLs = await Promise.all(downloadPromises);
      console.log("download certs", downloadURLs);
      downloadURLs.forEach((downloadURL) => {
        console.log("download certs", downloadURL);
        Linking.openURL(downloadURL);
      });
      Alert.alert(
        "Different file formats appear differently ",
        "Certs will appear either in your browser search history or downloads"
      );
    } catch (error) {
      console.log(
        "Error getting download URL for applicant files",
        applicant.userID,
        error
      );
    }
  };

  const reviewsOpen = async (applicant) => {
    try {
      navigation.navigate("PastReviews", {
        screen: "PastReviewsScreen",
        user: applicant,
        employer: false,
      });
    } catch (error) {
      console.log("HandlePlaceOpen", error);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = employerDetails.favorites.includes(item.userID);
    console.log("trustfactor", item.trustFactor);
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, padding: 6 }}>
            <Text style={styles.text}>Name: {item.fullName}</Text>
            <Text style={styles.text}>
              Experience: {item.experience.join(", ")}
            </Text>
            <Text style={styles.text}>TrustFactor: {item.trustFactor}</Text>
            <Text style={styles.text}>About: {item.description}</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
            {isFavorite && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.text, { marginRight: 10 }]}>
                  Favorited by you!
                </Text>
                <Image
                  source={require("../assets/star-filled.png")}
                  style={{
                    height: 50,
                    width: 50,
                    marginBottom: 10,
                    paddingLeft: 20,
                  }}
                />
              </View>
            )}
            {imageURLs[item.userID] ? (
              <Image
                source={{ uri: imageURLs[item.userID] }}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 10,
                  paddingLeft: 20,
                }}
              />
            ) : (
              <Image
                source={require("../assets/No_Image.jpg")}
                style={{ width: 100, height: 100 }}
              />
            )}
          </View>
        </View>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <SecondaryButton onPress={() => reviewsOpen(item.userID)}>
            View Past Reviews
          </SecondaryButton>
          <SecondaryButton onPress={() => handleDownloadCV(item)}>
            View CV
          </SecondaryButton>
        </View>
        <View style={{ flexDirection: "column", alignSelf: "center" }}>
          <SecondaryButton onPress={() => handleDownloadAllFiles(item)}>
            View Other Certs
          </SecondaryButton>
          {certsPress && (
            <Text style={styles.helpMessage}>Check Downloads For Certs</Text>
          )}
        </View>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <PrimaryButton onPress={() => handleAccept(item)}>
            Accept Employee
          </PrimaryButton>
        </View>
      </View>
    );
  };

  const sortedApplicants = applicants.sort((a, b) => {
    const aIsFavorite = employerDetails.favorites.includes(a.userID);
    const bIsFavorite = employerDetails.favorites.includes(b.userID);

    if (aIsFavorite && !bIsFavorite) {
      return -1;
    } else if (!aIsFavorite && bIsFavorite) {
      return 1;
    } else {
      return b.trustFactor - a.trustFactor;
    }
  });

  return (
    <View>
      <FlatList
        data={sortedApplicants}
        keyExtractor={(item) => item.userID}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  helpMessage: {
    fontSize: 16,
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default ViewApplicantsScreen;
