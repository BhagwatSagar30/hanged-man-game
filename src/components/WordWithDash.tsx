import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  word: string;
  userEnteredCharList: string[];
};

const WordWithDash = (props: Props) => {
  const { word, userEnteredCharList } = props;
  return (
    <View style={styles.mainView}>
      {word.split("").map((char, index) => (
        <Text
          style={(styles.gameNameTitle, { fontSize: 30, padding: 7 })}
          key={char + index}
        >
          {userEnteredCharList.includes(char) ? char : "_"}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
  },
  gameNameTitle: {
    color: "#000",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
});

export default memo(WordWithDash);
