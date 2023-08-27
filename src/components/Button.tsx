import React, { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  isDisable: boolean;
  handleSubmit: () => void;
};

const Button = (props: Props) => {
  const { isDisable, handleSubmit } = props;

  const onButtonClick = () => {
    handleSubmit();
  };

  return (
    <Pressable
      style={[styles.button, { opacity: isDisable ? 0.3 : 1 }]}
      onPress={onButtonClick}
      disabled={isDisable}
    >
      <Text style={styles.buttonTitle}>{"Submit"}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 20,
    backgroundColor: "#99bbff",
    height: 40,
    width: 100,
    justifyContent: "center",
    borderRadius: 6,
    alignSelf: "center",
  },
  buttonTitle: { color: "#000", textAlign: "center" },
});

export default memo(Button);
