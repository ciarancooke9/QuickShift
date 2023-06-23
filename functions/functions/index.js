/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable indent */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const stripe = require("stripe")("");

exports.createPaymentIntent = functions.https.onCall(async (context) => {
  // Check that the user is authenticated
  console.log("context", context.auth);
  if (!context.auth) {
    return { error: "no auth" };
  }

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-11-15" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1800,
    currency: "eur",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  // Return the client secret for the payment intent
  return {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: "",
  };
});

exports.updateEmployeesTrustFactor = functions
  .region("europe-west2")
  .firestore.document("Employees/{userId}/reviews/{reviewId}")
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    const reviewData = snapshot.data();
    const rating = reviewData.rating;
    const reviewsQuery = await db
      .collection("Employees")
      .doc(userId)
      .collection("reviews")
      .get();
    const numReviews = reviewsQuery.docs.length;
    let totalRating = rating;
    reviewsQuery.forEach((doc) => {
      const reviewData = doc.data();
      totalRating += reviewData.rating;
    });
    const trustFactor = totalRating / (numReviews + 1);
    await db.collection("Employees").doc(userId).update({ trustFactor });
    console.log(`Trust factor updated to ${trustFactor} for user ${userId}`);
  });

exports.updateEmployersTrustFactor = functions
  .region("europe-west2")
  .firestore.document("Employers/{userId}/reviews/{reviewId}")
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    const reviewData = snapshot.data();
    const rating = reviewData.rating;
    const reviewsQuery = await db
      .collection("Employers")
      .doc(userId)
      .collection("reviews")
      .get();
    const numReviews = reviewsQuery.docs.length;
    let totalRating = rating;
    reviewsQuery.forEach((doc) => {
      const reviewData = doc.data();
      totalRating += reviewData.rating;
    });
    const trustFactor = totalRating / (numReviews + 1);
    await db.collection("Employers").doc(userId).update({ trustFactor });
    console.log(`Trust factor updated to ${trustFactor} for user ${userId}`);
  });

exports.sendAdvertNotification = functions
  .region("europe-west2")
  .firestore.document("adverts/{advertId}")
  .onCreate(async (snapshot, context) => {
    const advertData = snapshot.data();
    const location = advertData.location;
    // Query for all users in the Employees collection with the same location value as the advert
    const employeeQuerySnapshot = await admin
      .firestore()
      .collection("Employees")
      .where("location", "==", location)
      .get();

    // Create an array of FCM registration tokens for the matching users
    const tokens = [];
    employeeQuerySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.fcmToken) {
        tokens.push(data.fcmToken);
      }
    });

    // Set the message payload
    const payload = {
      notification: {
        title: "New Advert Posted!",
        body: "Check out the latest advert in your location!",
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        screen: "AdvertsScreen",
      },
    };

    // Send FCM message to devices with matching registration tokens
    await admin.messaging().sendToDevice(tokens, payload);
  });

exports.sendMessageNotification = functions
  .region("europe-west2")
  .firestore.document("adverts/{advertId}/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const message = snapshot.data();
    const recipient = message.recipient;

    // Query Employees and Employers collections for the recipient
    const employeeQuery = admin
      .firestore()
      .collection("Employees")
      .where("userID", "==", recipient);
    const employerQuery = admin
      .firestore()
      .collection("Employers")
      .where("userID", "==", recipient);

    // Get the recipient document from either Employees or Employers collection
    let recipientDoc;
    let recipientType;
    const employeeDocs = await employeeQuery.get();
    const employerDocs = await employerQuery.get();

    if (employeeDocs.size === 1) {
      recipientDoc = employeeDocs.docs[0].data();
      recipientType = "Employee";
    } else if (employerDocs.size === 1) {
      recipientDoc = employerDocs.docs[0].data();
      recipientType = "Employer";
    } else {
      console.log(
        `Error: recipient with userID ${recipient} not found in Employees or Employers collections`
      );
      return null;
    }

    const fcmToken = recipientDoc.fcmToken;

    if (fcmToken) {
      const payload = {
        notification: {
          title: `Hi ${message.recipientName} have a new chat message from ${message.senderName}!`,
          body: message.text,
          clickAction: `FLUTTER_NOTIFICATION_CLICK`,
        },
      };

      // Send the notification using Firebase Cloud Messaging
      await admin.messaging().sendToDevice(fcmToken, payload);
      console.log(
        `Sent message notification to ${recipientType} with userID ${recipient}`
      );
    } else {
      console.log(
        `Error: fcmToken not found for recipient with userID ${recipient}`
      );
    }
  });

exports.sendApplicantNotification = functions
  .region("europe-west2")
  .firestore.document("adverts/{advertId}")
  .onUpdate(async (change, context) => {
    const advertData = change.after.data();
    const previousAdvertData = change.before.data();

    // Check if the applicants array has been modified
    if (
      advertData.applicants &&
      previousAdvertData.applicants &&
      advertData.applicants.length > previousAdvertData.applicants.length
    ) {
      // Get the new applicant
      const newApplicant =
        advertData.applicants[advertData.applicants.length - 1];

      // Get the employer object for this advert
      const employerSnapshot = await admin
        .firestore()
        .collection("Employers")
        .where("userID", "==", advertData.employer)
        .get();
      console.log(employerSnapshot);
      if (!employerSnapshot.empty) {
        const employerData = employerSnapshot.docs[0].data();

        // Send notification to the employer
        if (employerData.fcmToken) {
          const payload = {
            notification: {
              title: "New Applicant for Your Shift!",
              body: `${newApplicant.fullName} has applied for your job posting at ${advertData.time.startTime} ${advertData.time.date}.`,
            },
            data: {
              click_action: "FLUTTER_NOTIFICATION_CLICK",
              screen: "EmployerHomeScreen",
              advertId: context.params.advertId,
            },
          };

          await admin.messaging().sendToDevice(employerData.fcmToken, payload);
        }
      }
    }
  });

exports.sendConfirmationNotification = functions
  .region("europe-west2")
  .firestore.document("adverts/{advertId}")
  .onUpdate(async (change, context) => {
    const advertData = change.after.data();
    const previousAdvertData = change.before.data();
    if (
      advertData.employee &&
      advertData.active === false &&
      previousAdvertData.active === true
    ) {
      // Get the employee object for this advert
      const employeeSnapshot = await admin
        .firestore()
        .collection("Employees")
        .where("userID", "==", advertData.employee)
        .get();
      console.log(employeeSnapshot);
      if (employeeSnapshot.exists) {
        const employeeData = employeeSnapshot.data();

        // Send notification to the employee
        console.log(
          "helloooooooooooooo",
          advertData.employerName,
          advertData.time.startTime,
          advertData.time.date
        );
        if (employeeData.fcmToken) {
          const payload = {
            notification: {
              title: `You've Been Chosen for a Shift at ${advertData.employerName}!`,
              body: `Congratulations, you've been chosen for the job posting at ${advertData.time.startTime} ${advertData.time.date}.`,
            },
            data: {
              click_action: "FLUTTER_NOTIFICATION_CLICK",
              screen: "EmployeeHomeScreen",
              advertId: context.params.advertId,
            },
          };

          await admin.messaging().sendToDevice(employeeData.fcmToken, payload);
        }
      }
    }
  });
