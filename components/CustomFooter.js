import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-web";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CustomFooter = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="ticket-confirmation-outline"
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SwapRequests");
        }}
      >
        <AntDesign name="swap" color="black" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomFooter;

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
    backgroundColor: "#e9ecef",
  },
});
