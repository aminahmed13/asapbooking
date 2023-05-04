import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NotificationBadge = () => {
  // if (notificationCount === 0) {
  //   return null;
  // }

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    borderRadius: 100,
    // alignItems: "center",
    // justifyContent: "center",
    position: "absolute",
    top: -8,
    right: -8,
    width: 10,
    height: 10,
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default NotificationBadge;
