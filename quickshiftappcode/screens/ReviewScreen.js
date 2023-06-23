import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import CheckBox from "expo-checkbox";
import {
  doc,
  collection,
  where,
  serverTimestamp,
  query,
  arrayUnion,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../utils/firebaseUtils";

const ReviewScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { shift, employer, employee, currentUser } = route.params;
  const isEmployer = currentUser == employer ? true : false;
  const collectionRef = isEmployer ? "Employees" : "Employers";
  const reviewedUser = isEmployer ? employee : employer;
  const [userDocID, setUserDocID] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [reviewLength, setReviewLength] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const grabUserProfile = async () => {
        const usersRef = collection(db, collectionRef);
        const q = query(usersRef, where("userID", "==", reviewedUser));
        const querySnapshot = await getDocs(q);
        let userList = [];
        querySnapshot.forEach((doc) => {
          userList.push(doc.id);
        });
        setUserDocID(userList[0]);
      };

      setLoading(true);
      grabUserProfile();
      setLoading(false);
      return () => {};
    }, [])
  );

  const handleSubmit = async () => {
    if (reviewLength > 250) {
      Alert.alert("Reviews are limited to 250 charachters");
      return;
    }
    const reviewData = {
      rating: parseInt(rating),
      review: review,
      reviewedBy: currentUser,
      timestamp: serverTimestamp(),
    };

    const userRef = doc(db, collectionRef, userDocID);
    const reviewsRef = collection(userRef, "reviews");
    try {
      await addDoc(reviewsRef, reviewData);

      if (isEmployer && isFavorite) {
        const favoritesRef = collection(db, "Employers");
        const querySnapshot = await getDocs(
          query(favoritesRef, where("userID", "==", currentUser))
        );
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            favorites: arrayUnion(employee),
          })
            .then(() => {
              Alert.alert(
                "Review Added",
                "User trustfactor updated based on your review"
              );
              console.log("Document successfully updated!");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        });
      }
      // Navigate back to previous screen
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStarPress = (starCount) => {
    setRating(starCount);
  };
  const setReviewWithLimit = (text) => {
    setReview(text);
    setReviewLength(text.length);
  };

  const handleFavoriteCheck = () => {
    setIsFavorite(!isFavorite);
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <Image
            source={
              i <= rating
                ? require("../assets/star-filled.png")
                : require("../assets/star.png")
            }
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {/* Ternary operator used to dynamically change text based on employer or current user */}
        {employer === currentUser
          ? `Leave a review for your employee:`
          : `Leave a review for ${shift.employerName}:`}
      </Text>
      <Text>Rating:</Text>
      {/* Container to render star icons */}
      <View style={styles.ratingContainer}>{renderStars()}</View>
      <Text>Review:</Text>
      {/* Input for user to type their review */}
      <TextInput
        value={review}
        onChangeText={setReviewWithLimit}
        multiline
        style={styles.reviewInput}
      />

      {/* Checkbox for employer to add employee to favorites */}
      {isEmployer && (
        <View
          style={{ flexDirection: "column", alignItems: "center", padding: 10 }}
        >
          <Text>
            Tick Box if you would like to add this employee to your favorites
          </Text>
          <CheckBox value={isFavorite} onValueChange={setIsFavorite} />
        </View>
      )}
      {/* Button to submit review */}
      <PrimaryButton onPress={handleSubmit}>Submit Review</PrimaryButton>
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  star: {
    width: 32,
    height: 32,
    marginHorizontal: 2,
  },
  reviewInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
