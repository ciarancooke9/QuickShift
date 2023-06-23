import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
  Alert,
  Image,
} from "react-native";
import messaging from "@react-native-firebase/messaging";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { auth, db, firebaseApp } from "../utils/firebaseUtils";
import { collection, addDoc } from "firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import { MultipleSelectList } from "react-native-dropdown-select-list";

const EmployeeSignupScreen = ({ navigation }) => {
  const [employee, setEmployee] = useState({
    fullName: "",
    location: "",
    description: "",
  });
  console.log(auth.currentUser);
  const [selected, setSelected] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showDocPicker, setShowDocPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [CV, setCV] = useState([]);
  const [fcmToken, setfcmToken] = useState("");
  const [uploading, setUploading] = useState(null);

  const skills = [
    "Barwork",
    "Table Waiting",
    "Mixology",
    "Security",
    "Kitchen Work",
    "Retail",
    "Laboring",
    "Carpentry",
    "Plumbing",
    "Roofing",
  ];
  useFocusEffect(
    useCallback(() => {
      messaging()
        .getToken()
        .then((token) => {
          setfcmToken(token);
          console.log("signup fcm token", token);
        });
      return () => {};
    }, [])
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      uploadImage();
      uploadCV();
      uploadFiles();
      const userDb = collection(db, "Employees");
      console.log("adddoc token", fcmToken);
      addDoc(userDb, {
        location: employee.location,
        description: employee.description,
        experience: selected,
        fullName: employee.fullName,
        email: auth.currentUser.email,
        trustFactor: 7,
        userID: auth.currentUser.uid,
        fcmToken: fcmToken,
      });
      navigation.replace("Home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("pickimage", result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    // No permissions request is necessary for launching the image library
    setUploading(true);
    const reference = storage().ref(`images/${auth.currentUser.uid}.jpeg`);
    const pathToFile = image.uri;
    console.log("pathtofile", pathToFile);
    try {
      await reference.putFile(pathToFile);
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
    Alert.alert("Photo uploaded");
    setImage(null);
  };

  const pickCV = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
      });
      if (results.type === "success") {
        const fileExtension = results.name.split(".").pop();
        if (fileExtension.toLowerCase() === "pdf") {
          setCV([...CV, ...(Array.isArray(results) ? results : [results])]);
        } else {
          Alert.alert("Please select a PDF file");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickDocuments = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
      });

      if (results.type === "success") {
        const filteredResults = [results].filter(
          (result) => result.name.split(".").pop().toLowerCase() === "pdf"
        );
        setFiles([
          ...files,
          ...(Array.isArray(filteredResults)
            ? filteredResults
            : [filteredResults]),
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadCV = async () => {
    try {
      const reference = storage().ref(`files/${auth.currentUser.uid}`);
      await Promise.all(
        CV.map(async (file) => {
          const fileName = file.name;
          const response = await fetch(file.uri);
          const blob = await response.blob();
          const fileRef = reference.child(`CV`);
          await fileRef.put(blob);
        })
      );
      console.log("Files uploaded successfully!");
      setCV([]);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFiles = async () => {
    try {
      const reference = storage().ref(`files/${auth.currentUser.uid}`);
      await Promise.all(
        files.map(async (file) => {
          const fileName = file.name;
          const response = await fetch(file.uri);
          const blob = await response.blob();
          const fileRef = reference.child(`certs/${fileName}`);
          await fileRef.put(blob);
        })
      );
      console.log("Files uploaded successfully!");
      setFiles([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowImagePicker = () => {
    setShowImagePicker(!showImagePicker);
  };
  const handleShowDocPicker = () => {
    setShowDocPicker(!showDocPicker);
  };
  return (
    <View style={styles.formContainer}>
      <View style={styles.formContent}>
        <Text style={styles.heading}>Enter your full name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={employee.fullName}
          onChangeText={(text) => setEmployee({ ...employee, fullName: text })}
        />
        <Text style={styles.heading}>
          Enter a few words to describe you to employers
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={employee.description}
          onChangeText={(text) =>
            setEmployee({ ...employee, description: text })
          }
        />
        <View style={styles.buttonGroup}>
          <View>
            <Button title="Select Profile Pic" onPress={pickImage}></Button>
            <View>
              {image && <Text style={styles.helpMessage}> Image Ready</Text>}
            </View>
            <SecondaryButton onPress={uploadImage}>
              <Text> Upload Image </Text>
            </SecondaryButton>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonItem}>
            <Button title="Select CV" onPress={pickCV} />
          </View>
          <View>
            {CV.length > 0 && <Text style={styles.helpMessage}> CV Ready</Text>}
          </View>
          <View style={styles.buttonItem}>
            <SecondaryButton title="Upload CV" onPress={uploadCV}>
              <Text> Upload CV </Text>
            </SecondaryButton>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonItem}>
            <Button title="Select Documents" onPress={pickDocuments} />
          </View>
          <View>
            {files.length > 0 && (
              <Text style={styles.helpMessage}> Certs Ready</Text>
            )}
          </View>
          <View style={styles.buttonItem}>
            <SecondaryButton title="Upload Documents" onPress={uploadFiles}>
              <Text> Upload Documents </Text>
            </SecondaryButton>
          </View>
        </View>

        <MultipleSelectList
          setSelected={(val) => setSelected(val)}
          data={skills}
          save="value"
          onSelect={() => console.log(selected)}
          label="Categories"
        />
        <Text style={styles.heading}>Enter Region</Text>
        <TextInput
          style={styles.input}
          placeholder="Cavan"
          value={employee.location}
          onChangeText={(text) => setEmployee({ ...employee, location: text })}
        />
      </View>
      <PrimaryButton onPress={handleSubmit}>Register</PrimaryButton>
    </View>
  );
};

export default EmployeeSignupScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    height: "auto",
  },
  formContainer: {
    justifyContent: "center",
    flex: 2,
    alignItems: "center",
    height: "auto",
  },
  screen: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  submitButtonContainer: {
    borderRadius: 5,
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#008080",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  helpMessage: {
    fontSize: 16,
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333333",
  },
  checkbox: {
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  imagePickerContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000",
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center",
  },
});
