import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import color from "../../styles/colors";

const RadioButton = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.radioButtonContainer}
          onPress={() => {
            if (option.value == selectedOption) {
              setSelectedOption("");
            } else {
              setSelectedOption(option.value);
            }
          }}
        >
          <View
            style={[
              styles.radioButton,
              selectedOption === option.value && styles.radioButtonSelected,
            ]}
          >
            {selectedOption === option.value && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexGrow: 1,
    flexBasis: "50%",
  },
  radioButton: {
    height: 16,
    width: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C7C7C7",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    backgroundColor: color.light_orange,
    borderColor: color.light_orange,
  },

  label: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default RadioButton;
