import { StyleSheet } from "react-native";
import React from "react";
import { Input } from "@rneui/base";
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
      textAlignVertical={props.textAlignVertical}
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
      errorStyle={props.errorStyle}
      errorMessage={props.errorMessage}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({});
