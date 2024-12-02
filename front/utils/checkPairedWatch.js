import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const fetchPairedWatch = async () => {
  try {
    const storedPairedWatch = await AsyncStorage.getItem("pairedWatch");
    console.log("Stored Paired Watch:", storedPairedWatch);

    const pairedWatchStatus = storedPairedWatch ? storedPairedWatch : false;
    // Alert.alert("워치연동 여부: ", pairedWatchStatus);
    return pairedWatchStatus;
  } catch (error) {
    console.error("Error fetching paired watch:", error);
    return false; // 에러가 발생했을 경우에도 false를 반환
  }
};

export const savePairedWatch = async () => {
  try {
    await AsyncStorage.setItem("pairedWatch", "true");
    console.log("Paired Watch value saved successfully");
  } catch (error) {
    console.error("Error saving Paired Watch:", error);
  }
};
