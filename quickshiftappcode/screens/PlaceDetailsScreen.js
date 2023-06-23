import React, { useState, useCallback, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { GOOGLEAPIKEY } from "../utils/googleAPI";

const PlaceDetailsScreen = ({ route, navigation }) => {
  const { placeID } = route.params.advert;
  const [reviews, setReviews] = useState([]);
  const [images, setImages] = useState([]);
  const [openingHours, setOpeningHours] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.header}>{route.params.advert.employerName}</Text>
      ),
    });
  }, [navigation, route.params.advert.employerName]);

  useFocusEffect(
    useCallback(() => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&fields=name,rating,photos,review,opening_hours&key=${GOOGLEAPIKEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          setReviews(data.result.reviews);
          setImages(data.result.photos);
          setOpeningHours(data.result.opening_hours);
        })
        .catch((error) => console.error(error));
    }, [])
  );

  const renderReview = ({ item }) => {
    const rating = item.rating;
    const stars = [];

    for (let i = 0; i < rating; i++) {
      stars.push(
        <Image
          key={i}
          source={require("../assets/star-filled.png")}
          style={styles.star}
        />
      );
    }

    return (
      <View style={styles.review}>
        <View style={styles.rating}>{stars}</View>
        <Text style={styles.author}>{item.author_name}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.reviews}>
        <Text style={styles.title}>Reviews:</Text>
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.time}
        />
      </View>
      <View style={styles.openingHours}>
        <Text style={styles.title}>Opening Hours:</Text>
        {openingHours &&
          openingHours.weekday_text &&
          openingHours.weekday_text.map((day, index) => (
            <Text key={index} style={styles.day}>
              {day}
            </Text>
          ))}
      </View>
      <View style={styles.images}>
        <Text style={styles.title}>Photos:</Text>
        <FlatList
          horizontal={true}
          data={images}
          renderItem={({ item }) => (
            <Image
              key={item.photo_reference}
              source={{
                uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${GOOGLEAPIKEY}`,
              }}
              style={styles.image}
            />
          )}
          keyExtractor={(item) => item.photo_reference}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  reviews: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  openingHours: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  day: {
    fontSize: 16,
    marginBottom: 2,
    color: "#555",
  },
  review: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rating: {
    flexDirection: "row",
    marginBottom: 8,
  },
  author: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    marginBottom: 8,
  },
  images: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: 300,
    height: 300,
    marginRight: 8,
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  header: { fontSize: 30 },
});

export default PlaceDetailsScreen;
