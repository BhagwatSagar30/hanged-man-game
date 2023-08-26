import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import {
  getHighestScore,
  getRandomWord,
  storeHighestScore,
} from "../utils/Utils";
import { HIGH_SCORE, MAX_COUNT } from "../constants/Constants";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

type Props = {};

const HangedManGame = memo((props: Props) => {
  const [userEnteredCharList, setUserEnteredCharList] = useState([]);
  const [inputChar, setInputChar] = useState("");
  const [randomWord, setRandomWord] = useState(getRandomWord());
  const [playerScore, setplayerScore] = useState(0);
  const [highestScore, sethighestScore] = useState(0);
  const [isDisable, setDisable] = useState(true);
  const [livesAvailable, setLivesAvailable] = useState(MAX_COUNT);
  const { getItem, setItem } = useAsyncStorage(HIGH_SCORE);

  /**
   * uses diffrent API to store values because some of are not working in ios and Android
   */
  const readItemFromStorage = async () => {
    let highScore;
    if (Platform.OS === "android") {
      highScore = await getItem();
    } else if (Platform.OS === "ios") {
      highScore = await getHighestScore(HIGH_SCORE);
    }
    sethighestScore(Number(highScore));
  };

  /**
   * uses diffrent API to store values because some of are not working in ios and Android
   * @param newValue value need to store
   */
  const writeItemToStorage = async (newValue) => {
    if (highestScore <= newValue) {
      if (Platform.OS === "android") {
        await setItem(String(newValue + 1));
      } else if (Platform.OS === "ios") {
        await storeHighestScore(HIGH_SCORE, String(newValue + 1));
      }
      readItemFromStorage();
    }
  };

  /**
   * load previous old Highest score first time only
   */
  useEffect(() => {
    readItemFromStorage();
  }, []);

  useEffect(() => {
    const res = randomWord
      .split("")
      .map((ltr) => (userEnteredCharList.includes(ltr) ? ltr : "_"));
    if (randomWord === res.join("")) {
      alert("You Win");
      clearData();
      setplayerScore((prev) => prev + 1);
      writeItemToStorage(playerScore);
    }

    return () => {};
  }, [inputChar, userEnteredCharList, livesAvailable, playerScore]);

  const clearData = () => {
    setDisable(true);
    setInputChar("");
    setUserEnteredCharList([]);
    setRandomWord(getRandomWord());
    setLivesAvailable(7);
  };

  const handleSubmit = () => {
    if (livesAvailable === 1) {
      alert("You loose. Please try again with new word");
      clearData();
      setplayerScore(0);
      return;
    }
    if (!userEnteredCharList.includes(inputChar)) {
      setUserEnteredCharList([...userEnteredCharList, inputChar]);
    }
    if (!randomWord.includes(inputChar)) {
      setLivesAvailable((prev) => prev - 1);
    }
    setDisable(true);
    setInputChar("");
  };

  const handleInputChar = (value) => {
    const regex = /^[A-Za-z]+$/; //take only char not other value
    if (value.length !== 0 && regex.test(value)) {
      setInputChar(value);
      setDisable(false);
    } else {
      setInputChar("");
    }
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <Text style={styles.gameNameTitle}>{" The Hanged Man Game "}</Text>
      <Text style={styles.gameNameTitle}>
        {"Highest score : " + highestScore}
      </Text>
      <Text style={styles.gameNameTitle}>
        {"Player score : " + playerScore}
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignSelf: "center",
        }}
      >
        {randomWord.split("").map((char, index) => (
          <Text
            style={(styles.gameNameTitle, { fontSize: 30, padding: 7 })}
            key={char + index}
          >
            {userEnteredCharList.includes(char) ? char : "_"}
          </Text>
        ))}
      </View>
      <TextInput
        style={styles.inputText}
        maxLength={1}
        value={inputChar}
        onChangeText={handleInputChar}
        autoCapitalize={"none"}
      />

      <Pressable
        style={[styles.button, { opacity: isDisable ? 0.3 : 1 }]}
        onPress={handleSubmit}
        disabled={isDisable}
      >
        <Text style={styles.buttonTitle}>{"Submit"}</Text>
      </Pressable>

      <Text style={styles.gameNameTitle}>
        {"Lives Available = " + livesAvailable}
      </Text>
    </SafeAreaView>
  );
});

export default HangedManGame;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  gameNameTitle: {
    color: "#000",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  inputText: {
    height: 40,
    width: 60,
    borderRadius: 3,
    backgroundColor: "#ebebeb",
    marginVertical: 30,
    alignSelf: "center",
    textAlign: "center",
  },
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
