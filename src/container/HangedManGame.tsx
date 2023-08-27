import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  getHighestScore,
  getRandomWord,
  storeHighestScore,
} from "../utils/Utils";
import { HIGH_SCORE, MAX_COUNT } from "../constants/Constants";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import InputText from "../components/InputText";
import { useStateWithCallback } from "../customHooks/useStateWithCallback";
import WordWithDash from "../components/WordWithDash";

type Props = {};

const HangedManGame = memo((props: Props) => {
  const [userEnteredCharList, setUserEnteredCharList] = useState([]);
  const [inputChar, setInputChar] = useState("");
  const [randomWord, setRandomWord] = useState(getRandomWord());
  const [playerScore, setplayerScore] = useState(0);
  const [highestScore, sethighestScore] = useState(0);
  const [isDisable, setDisable] = useState(true);
  // const [livesAvailable, setLivesAvailable] = useState(MAX_COUNT);
  const [livesAvailable, setLivesAvailable] = useStateWithCallback(MAX_COUNT);
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
    const enterWord = randomWord
      .split("")
      .map((char) => (userEnteredCharList.includes(char) ? char : "_"));

    if (livesAvailable === 0) {
      alert("You loose. Please try again with new word");
      clearData();
      setplayerScore(0);
      return;
    }

    if (randomWord === enterWord.join("")) {
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
    if (!userEnteredCharList.includes(inputChar)) {
      setUserEnteredCharList([...userEnteredCharList, inputChar]);
    }
    if (!randomWord.includes(inputChar)) {
      setLivesAvailable(livesAvailable - 1);
    }
    setDisable(true);
    setInputChar("");
  };

  const handleInputTextChange = useCallback(
    (value) => {
      const regex = /^[A-Za-z]+$/; //take only char not other value
      if (value.length !== 0 && regex.test(value)) {
        setInputChar(value);
        setDisable(false);
      } else {
        setInputChar("");
      }
    },
    [setInputChar, setDisable]
  );

  return (
    <SafeAreaView style={styles.mainView}>
      <Text style={styles.gameNameTitle}>{" The Hanged Man Game "}</Text>
      <Text style={styles.gameNameTitle}>
        {"Highest score : " + highestScore}
      </Text>
      <Text style={styles.gameNameTitle}>
        {"Player score : " + playerScore}
      </Text>

      <WordWithDash
        word={randomWord}
        userEnteredCharList={userEnteredCharList}
      />
      <InputText
        inputChar={inputChar}
        handleInputTextChange={handleInputTextChange}
      />

      <Button handleSubmit={handleSubmit} isDisable={isDisable} />

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
});
