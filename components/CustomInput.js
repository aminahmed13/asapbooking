import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Input, Image } from "@rneui/base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

const CustomInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      multiline={props.multiline}
      numberOfLines={props.multiline ? props.numberOfLines : 1}
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChangeText}
      keyboardType={props.keyboardType}
      autoCapitalize={props.autoCapitalize}
      label={props.label}
      secureTextEntry={props.secureTextEntry}
      labelStyle={{
        marginBottom: 5,
        fontWeight: "400",
        color: "black",
      }}
      inputContainerStyle={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "gray",
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
      leftIcon={props.leftIcon}
      rightIcon={props.rightIcon}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({});
