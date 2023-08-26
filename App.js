import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HangedManGame from "./src/container/HangedManGame";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <HangedManGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
