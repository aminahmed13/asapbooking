import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../firebase";
import { useState } from "react";

const ServiceOption = (props) => {
  const colRef = collection(db, "tickets");

  // waiting tickets in the specific service
  const [waitingTickets, setWaitingTickets] = useState([]);
  const q_waiting = query(
    colRef,
    where("status", "==", "waiting"),
    where("serviceId", "==", props.serviceId),
    orderBy("timestamp")
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(q_waiting, (snapshot) => {
      setWaitingTickets(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        // marginHorizontal: 20,
        marginVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: "whitesmoke",
      }}
    >
      <View
        style={{
          marginBottom: 15,
          marginHorizontal: 20,
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
          <MaterialCommunityIcons
            name="seat-passenger"
            size={18}
            type="antdesign"
            color="#5e17eb"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "#5e17eb" }}>
            Waiting in Line {waitingTickets.length}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 15,
          marginHorizontal: 20,
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
