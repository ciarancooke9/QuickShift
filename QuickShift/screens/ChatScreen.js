import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FirebaseApp } from "firebase/app";
import {
  doc,
  collection,
  query,
  addDoc,
  orderBy,
  onSnapshot,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../utils/firebaseUtils";

const ChatScreen = ({ route }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const advertId = route.params.advertId;
  const currentUser = route.params.currentUser;
  const employerId = route.params.employer;
  console.log(route.params.currentUser);

  // Retrieve messages from Firebase
  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      const advertRef = doc(db, "adverts", advertId);
      const messageRef = collection(advertRef, "messages");
      const messageQuery = query(messageRef, orderBy("timestamp"), limit(50));

      // Listen for new messages
      const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        console.log("chat", messages);
        setMessages(messages);
      });

      return () => {
        unsubscribe();
      };
    }, [advertId])
  );

  // Send message to Firebase
  const sendMessage = async () => {
    console.log("message sent");
    const advertRef = doc(db, "adverts", advertId); // Update this line
    const messagesRef = collection(advertRef, "messages");

    try {
      await addDoc(messagesRef, {
        text: inputText,
        sender: currentUser,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }

    setInputText("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === employerId
                ? styles.employeeMessage
                : styles.employerMessage,
            ]}
          >
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          placeholder="Type a message..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  message: {
    padding: 8,
    borderRadius: 8,
    margin: 8,
    maxWidth: "80%",
  },
  employeeMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#bdeeff",
  },
  employerMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#bdeeff",
    padding: 8,
    borderRadius: 8,
  },
  sendButtonText: {
    fontWeight: "bold",
  },
});

export default ChatScreen;
