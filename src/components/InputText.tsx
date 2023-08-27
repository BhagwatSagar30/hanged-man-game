import React, { memo } from "react";
import { StyleSheet, TextInput } from "react-native";

type Props = {
  inputChar: string;
  handleInputTextChange: (role: string) => void;
};

const InputText = (props: Props) => {
  const { inputChar, handleInputTextChange } = props;

  const onTextChange = (value) => {
    handleInputTextChange(value);
  };

  return (
    <TextInput
      style={styles.inputText}
      maxLength={1}
      value={inputChar}
      onChangeText={onTextChange}
      autoCapitalize={"none"}
    />
  );
};

const styles = StyleSheet.create({
  inputText: {
    height: 40,
    width: 60,
    borderRadius: 3,
    backgroundColor: "#ebebeb",
    marginVertical: 30,
    alignSelf: "center",
    textAlign: "center",
  },
});

export default memo(InputText);
