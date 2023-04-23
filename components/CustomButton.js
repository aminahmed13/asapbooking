import { StyleSheet } from "react-native";
import React from "react";
import { Button } from "@rneui/base";

const CustomButton = (props) => {
  return (
    <Button
      title={props.title}
      onPress={props.onPress}
      buttonStyle={{
        marginVertical: 5,
        backgroundColor: props.buttonColor,
        borderRadius: 10,
      }}
    />
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
