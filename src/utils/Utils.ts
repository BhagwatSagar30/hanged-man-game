import AsyncStorage from "@react-native-async-storage/async-storage";
import { WORDS } from "../constants/Constants";
import * as SecureStore from "expo-secure-store";

// Pick random word
export function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length) + 0];
}

export async function storeHighestScore(key, value) {
  return await SecureStore.setItemAsync(key, value);
}

export const getHighestScore = async (key) => {
  return await SecureStore.getItemAsync(key);
};

export async function storeHighestScoreAsync(key, value) {
  return await AsyncStorage.setItem(key, value);
}

export const getstoreHighestScoreAsync = async (key) => {
  return await AsyncStorage.getItem(key);
};
