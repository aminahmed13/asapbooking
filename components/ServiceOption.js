import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ServiceOption = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#888",
      }}
    >
      <View
        style={{
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            color: "#5e17eb",
            fontWeight: "700",
            fontSize: 18,
            marginBottom: 5,
          }}
        >
          {props.serviceName}
        </Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Icon
            name="lock"
            size={18}
            type="antdesign"
            color="#5e17eb"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "#5e17eb" }}>
            Waiting in Line {props.waiting}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity
          onPress={props.onPress}
          activeOpacity={0.5}
          style={{
            backgroundColor: "#ede6fd",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Get Ticket
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceOption;

const styles = StyleSheet.create({});
