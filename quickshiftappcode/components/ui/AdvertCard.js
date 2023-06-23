import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Card = ({ data, completed = true }) => {
  const navigation = useNavigation();

  const handleMapOpen = async (adverts) => {
    try {
      navigation.navigate("Map", {
        screen: "MapScreen",
        adverts: [data],
      });
    } catch (error) {
      console.log("handlemapopn", error);
    }
  };

  const reviewsOpen = async (adverts) => {
    try {
      navigation.navigate("PastReviews", {
        screen: "PastReviewsScreen",
        user: data.employer,
        employer: true,
      });
    } catch (error) {
      console.log("HandlePlaceOpen", error);
    }
  };
  const handlePlaceOpen = async (adverts) => {
    try {
      navigation.navigate("PlaceDetails", {
        screen: "PlaceDetailsScreen",
        advert: data,
      });
    } catch (error) {
      console.log("HandlePlaceOpen", error);
    }
  };

  return (
    <View style={styles.container}>
      {completed && (
        <Text style={styles.title}>Employer: {data.employerName}</Text>
      )}
      <Text style={styles.text}>Work Type: {data.type}</Text>
      <Text style={styles.text}>Address: {data.address}</Text>
      <Text style={styles.text}>
        Hours: {data.hours} | Pay: {data.pay}
      </Text>
      <Text style={styles.text}>Region: {data.location}</Text>
      <Text style={styles.text}>
        Date: {data.time.date} | Start Time: {data.time.startTime}
      </Text>
      {completed && (
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.placeButton}
              onPress={handlePlaceOpen}
            >
              <Text style={styles.buttonText}>Business Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton} onPress={handleMapOpen}>
              <Text style={styles.buttonText}>Map</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.mapButton} onPress={reviewsOpen}>
              <Text style={styles.buttonText}>View User Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  mapButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  placeButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Card;
