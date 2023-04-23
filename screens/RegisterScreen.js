import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, CheckBox, Text, Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { KeyboardAvoidingView } from "react-native";
import {
  createUserWithEmailAndPassword,
  updatePhoneNumber,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

const RegisterScreen = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfrimPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log(cred.user);
        updateProfile(cred.user, {
          displayName: fullName,
        });
      })

      .catch((err) => console.log("This is your error: ", err));
  };

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.background}></View>
      <View style={styles.formContainer}>
        <CustomInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          keyboardType="default"
          autoCapitalize="words"
          label="Full name"
          leftIcon={
            <Icon
              name="user"
              size={24}
              type="antdesign"
              color="black"
              style={{ marginRight: 10 }}
            />
          }
          returnKeyType="next"
        />
        <CustomInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
          label="Phone Number"
          leftIcon={
            <Icon
              name="phone"
              size={24}
              type="antdesign"
              color="black"
              style={{ marginRight: 10 }}
            />
          }
          returnKeyType="next"
        />
        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          label="Email"
          leftIcon={
            <Icon
              name="envelope"
              size={24}
              type="antdesign"
              color="black"
              style={{ marginRight: 10 }}
            />
          }
          returnKeyType="next"
        />
        <CustomInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          label="Password"
          secureTextEntry={!passwordVisibility}
          leftIcon={
            <Icon
              name="lock"
              size={24}
              type="antdesign"
              color="black"
              style={{ marginRight: 10 }}
            />
          }
          rightIcon={
            <TouchableOpacity
              onPress={() => setPasswordVisibility(!passwordVisibility)}
            >
              <Icon
                name={passwordVisibility ? "eye-slash" : "eye"}
                color="#888"
                size={24}
                type="antdesign"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          }
          returnKeyType="next"
        />
        <CustomInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfrimPassword}
          label="Confirm Password"
          secureTextEntry={!confirmPasswordVisibility}
          leftIcon={
            <Icon
              name="lock"
              size={24}
              type="antdesign"
              color="black"
              style={{ marginRight: 10 }}
            />
          }
          rightIcon={
            <TouchableOpacity
              onPress={() =>
                setConfirmPasswordVisibility(!confirmPasswordVisibility)
              }
            >
              <Icon
                name={confirmPasswordVisibility ? "eye-slash" : "eye"}
                color="#888"
                size={24}
                type="antdesign"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          }
          returnKeyType="done"
        />

        <CustomButton
          title="Register"
          onPress={handleRegister}
          buttonColor="#5e17eb"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#5e17eb",
  },
  background: {},
  formContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgetPasswordLink: {
    color: "blue",
    textDecorationLine: "underline",
  },

  createAccountLink: {
    textAlign: "center",
    fontSize: 16,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
