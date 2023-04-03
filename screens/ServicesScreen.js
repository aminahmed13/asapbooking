import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ServiceOption from "../components/ServiceOption";

const ServicesScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Choose a service",
      headerTitleStyle: {
        color: "#fff",
        fontSize: 25,
      },
      headerStyle: {
        backgroundColor: "#5e17eb",
      },
    });
  });

  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "100vh",
      }}
    >
      <ServiceOption serviceName="Add/Drop" waiting="3" />
      <ServiceOption serviceName="Provost" waiting="2" />
      <ServiceOption serviceName="Alumni Office" waiting="1" />
      <ServiceOption serviceName="Registration" waiting="0" />
    </View>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({});
