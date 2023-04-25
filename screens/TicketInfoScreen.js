import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import {
  collection,
  documentId,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const TicketInfoScreen = ({ route, navigation }) => {
  const [turn, setTurn] = useState(true);
  const [ticket, setTicket] = useState([]);
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((err) => {
        alert(err);
      });
  };

  const { ticketId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Your Ticket",
      headerTitleStyle: {
        color: "#fff",
        fontSize: 25,
      },
      headerStyle: {
        backgroundColor: "#5e17eb",
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={signOutUser}
          activeOpacity={0.5}
          style={{
            marginRight: 15,
          }}
        >
          <Icon name="sign-out" color="white" size={24} />
        </TouchableOpacity>
      ),
    });
  });

  const colRef = collection(db, "tickets");
  const q = query(
    colRef,
    where(documentId(), "==", ticketId)
    // orderBy("timestamp")
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTicket(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  const ticketNumber = ticket[0]?.data.ticketNumber;
  useEffect(() => {
    console.log(ticket);
    console.log(ticketNumber);
  }, [ticket]);

  const handleCancelTicket = () => {
    console.log("cancel ticket");
  };
  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "100vh",
      }}
    >
      <View
        style={{
          marginTop: 30,
          // flex: 1,

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#5e17eb",
            fontSize: 18,
          }}
        >
          Your Queue Number
        </Text>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 35,
          }}
        >
          {ticketNumber}
        </Text>
      </View>
      <View style={styles.ticketDetailsContainer}>
        <View style={styles.ticketDetails}>
          <Text style={styles.label}>Now Serving</Text>
          <Text style={styles.info}>A304</Text>
        </View>
        <View style={styles.ticketDetails}>
          <Text style={styles.label}>Estimated Call Time</Text>
          <Text style={styles.info}>task comp time</Text>
        </View>
        <View style={styles.ticketDetails}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.info}>service name</Text>
        </View>
      </View>
      {turn && (
        <View
          style={{
            marginTop: 50,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginHorizontal: 30,
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                color: "#36db28",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              Your turn has reached. Please proceed to counter
            </Text>
            <Text
              style={{
                fontWeight: 800,
                fontSize: 50,
              }}
            >
              2
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 50,
            }}
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#42e134",
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
              >
                <Icon name="check" color="white" size={30} />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                I am available
              </Text>
            </View>

            <View
              style={{
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#ff0505",
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
              >
                <Icon name="close" color="white" size={30} />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                I'm not available
              </Text>
            </View>
          </View>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cancel Ticket"
          onPress={handleCancelTicket}
          buttonColor="#ff0505"
        />
      </View>
    </View>
  );
};

export default TicketInfoScreen;

const styles = StyleSheet.create({
  ticketDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 100,
    marginBottom: 20,
  },
  label: {
    color: "#828181",
  },
  info: {
    color: "#5e17eb",
  },
  ticketDetailsContainer: {
    marginTop: 50,

    justifyContent: "center",
  },
  buttonContainer: {
    marginHorizontal: 50,
    marginTop: 200,
  },
});

/*
1. your queue number --> ticketNumber
2. now Serving --> ??
3. Estimated time call:
    a. get serviceId from ticket 
    b. get task completion time from service collection
    c. get "waiting" tickets that has the same serviceId 
    d. multiply the number of tickets we get from c by the task completion time we get from b
4. Service --> ServiceId --> Service collection --> service_name

cancel ticket--> 
  1. update ticket status to cacelled
  2. go back to services page



what more features can we add
*/
