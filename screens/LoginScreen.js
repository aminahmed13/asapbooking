import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, CheckBox, Text, Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleLogin = () => {
    // Handle login logic here
  };

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.background}></View>
      <View style={styles.formContainer}>
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
          returnKeyType="done"
        />
        <View style={styles.checkboxContainer}>
          <CheckBox
            title="Remember me"
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
          />
          <TouchableOpacity onPress={() => console.log("Forgot password")}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <CustomButton
          title="Login"
          onPress={handleLogin}
          buttonColor="#5e17eb"
        />

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>
            Don't have an account?{" "}
            <Text style={styles.link}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#5e17eb",
  },
  background: {
    height: "50%",
  },
  formContainer: {
    height: "50%",
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
    // marginVertical: 5,
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

export default LoginScreen;
