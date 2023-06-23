import { StyleSheet, Text, View, Button, Alert, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseUtils";
import functions from "@react-native-firebase/functions";
import { useStripe } from "@stripe/stripe-react-native";
import { collection, addDoc } from "firebase/firestore";
import AdvertCard from "../components/ui/AdvertCard";

const CheckoutScreen = ({ route, navigation }) => {
  const jobObject = route.params.advert;
  console.log("checkout params", jobObject);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    console.log("fetchPaymentSheetPArams");
    const user = auth.currentUser;
    const userToken = await user.getIdToken();

    const response = await functions().httpsCallable("createPaymentIntent")({
      auth: userToken,
    });

    console.log(response);
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    console.log("initializePaymentSheet");
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error: ${error.code}`, error.message);
    } else {
      createAdvert();
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const createAdvert = async () => {
    try {
      const advertsDb = collection(db, "adverts");
      addDoc(advertsDb, jobObject);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "EmployerHome",
          },
        ],
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
      <Text style={styles.heading}> Your Job Posting ↓</Text>
      <AdvertCard data={jobObject} completed={false} />

      <Button
        style={{ padding: 20, borderRadius: 10 }}
        onPress={openPaymentSheet}
        title="Checkout €18"
        disabled={!loading}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/just-logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  button: { padding: 20, margin: 20, borderRadius: 10 },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
    textAlign: "center",
  },
  logoContainer: {
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 500,
    height: 400,
  },
});
