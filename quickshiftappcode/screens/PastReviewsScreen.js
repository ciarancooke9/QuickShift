import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { auth, db } from "../utils/firebaseUtils";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const PastReviewsScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const user = route.params.user;
  const isEmployer = route.params.employer;

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      const fetchEmployer = async () => {
        const q = query(
          collection(db, "Employers"),
          where("userID", "==", user)
        );

        try {
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (doc) => {
            const reviewsRef = collection(doc.ref, "reviews");
            const reviewsQuerySnapshot = await getDocs(reviewsRef);
            const reviewsArray = [];
            reviewsQuerySnapshot.forEach((reviewDoc) => {
              reviewsArray.push(reviewDoc.data());
            });
            setReviews(reviewsArray);
          });
          setLoading(false);
        } catch (e) {
          // Handle error
        }
      };

      const fetchEmployee = async () => {
        const q = query(
          collection(db, "Employees"),
          where("userID", "==", user)
        );

        try {
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (doc) => {
            const reviewsRef = collection(doc.ref, "reviews");
            const reviewsQuerySnapshot = await getDocs(reviewsRef);
            const reviewsArray = [];
            reviewsQuerySnapshot.forEach((reviewDoc) => {
              reviewsArray.push(reviewDoc.data());
            });
            setReviews(reviewsArray);
          });
          setLoading(false);
        } catch (e) {
          // Handle error
        }
      };

      isEmployer ? fetchEmployer() : fetchEmployee();

      return () => {
        setLoading(false);
      };
    }, [route])
  );

  const renderReview = ({ item }) => {
    const rating = item.rating;
    const stars = [];
    const date = new Date(
      item.timestamp.seconds * 1000 + item.timestamp.nanoseconds / 1000000
    );

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
        <Text style={styles.author}>{date.toLocaleString()}</Text>
        <Text style={styles.text}>{item.review}</Text>
      </View>
    );
  };

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default PastReviewsScreen;

const styles = StyleSheet.create({
  author: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  rating: {
    flexDirection: "row",
  },
  star: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  review: {
    margin: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
