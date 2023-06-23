import { Text, View, Pressable, StyleSheet } from "react-native";

function PrimaryButton({ children, onPress }) {
  //takes button text as prop
  function pressHandler(params) {
    console.log("pressed");
  }

  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple="green"
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonInnerContainer: {
    backgroundColor: "#70db70",
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 15,
    elevation: 2,
  },

  buttonOuterContainer: {
    borderRadius: 15,
    padding: 8,
    margin: 4,
    overflow: "hidden",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 25,
  },
  pressed: {
    opacity: 0.75,
  },
});
