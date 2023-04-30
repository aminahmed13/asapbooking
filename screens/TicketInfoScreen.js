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
  const [turn, setTurn] = useState(false);
  const [ticket, setTicket] = useState([]);
  const [waitingTickets, setWaitingTickets] = useState([]);
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((err) => {
        alert(err);
      });
  };

  const { ticketId, serviceId, serviceName, task_completion_time } =
    route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "YOUR TICKET",
      headerTitleStyle: {
        color: "#fff",
        fontSize: 15,
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

  // to get the waiting tickets, --> show current, and show estimating remaining time
  const q_waiting = query(
    colRef,
    where("status", "==", "waiting"),
    where("serviceId", "==", serviceId),
    orderBy("timestamp")
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(q_waiting, (snapshot) => {
      setWaitingTickets(
        snapshot?.docs?.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  //  current ticket
  const q = query(colRef, where(documentId(), "==", ticketId));

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
  const customerId = ticket[0]?.data.customerId;
  const nowServing = waitingTickets[0]?.data.ticketNumber;

  // index of the current ticket in the waiting list i.e. number of ppl before you in the queue
  const index = waitingTickets.findIndex((obj) => obj.id == ticketId);

  //estimated call time = index * task_completion_time_of_the_service

  let estimated_call_time;
  if (index >= 0) {
    estimated_call_time = `${index * task_completion_time} mins`;
  }
  // if index=0 this means his turn has reached, so a component will appear in the screen to notify the user
  // if (index == 0) {
  //   setTurn(true);
  // }
  // debugging
  useEffect(() => {
    // console.log(ticket);
    // console.log(ticketNumber);
    // console.log(customerId);
    console.log(waitingTickets[0]?.data.ticketNumber);
    console.log(waitingTickets[0]?.id);
  }, [waitingTickets]);

  // cancel ticket deletes the current ticket and returns back to services screen
  const handleCancelTicket = () => {
    console.log("cancel ticket");
  };

  const handleRequestSwap = () => {
    console.log("request swap clicked");
    navigation.navigate("Swap", {
      ticketId: ticketId,
      ticketNumber: ticketNumber,
      customerId: customerId,
      serviceId: serviceId,
    });
  };
  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "100%",
        position: "relative",
      }}
    >
      <View style={styles.ticketCard}>
        <View
          style={{
            marginTop: 16,
            // flex: 1,

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#5e17eb",
              fontSize: 18,

              fontWeight: 500,
            }}
          >
            Your Queue Number
          </Text>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 50,
            }}
          >
            {ticketNumber}
          </Text>
        </View>
        <View style={styles.ticketDetailsContainer}>
          <View style={styles.ticketDetails}>
            <Text style={styles.label}>Now Serving</Text>
            <Text style={styles.info}>{index >= 0 && nowServing}</Text>
          </View>
          <View style={styles.ticketDetails}>
            <Text style={styles.label}>Estimated Call Time</Text>
            <Text style={styles.info}>{estimated_call_time}</Text>
          </View>
          <View style={styles.ticketDetails}>
            <Text style={styles.label}>Service</Text>
            <Text style={styles.info}>{serviceName}</Text>
          </View>
        </View>
      </View>

      {index == 0 && (
        <View
          style={{
            marginTop: 50,
          }}
        >
          <View
            style={{
              alignItems: "center",
              textAlign: "center",
              marginHorizontal: 30,
              marginBottom: 30,
            }}
          >
            <View
              style={{
                width: 150,
                height: 150,
                backgroundColor: "#51cf66",
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Icon name="bell" color="white" size={100} />
            </View>
            <Text
              style={{
                color: "#51cf66",
                fontSize: 20,
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              It's your turn! Please proceed.
            </Text>
            {/* <Text
              style={{
                fontWeight: 800,
                fontSize: 50,
              }}
            >
              2
            </Text> */}
          </View>
          {/* <View
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
          </View> */}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cancel Ticket"
          onPress={handleCancelTicket}
          buttonColor="#ff0505"
        />
        <CustomButton
          title="Request Swap"
          onPress={handleRequestSwap}
          buttonColor="#5e17eb"
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
    marginHorizontal: 30,
    marginBottom: 20,
  },
  ticketCard: {
    backgroundColor: "#e9ecef",
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  label: {
    color: "#212529",
    fontSize: 16,
  },
  info: {
    color: "#5e17eb",
    fontSize: 16,
    fontWeight: 500,
  },
  ticketDetailsContainer: {
    marginTop: 20,

    justifyContent: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 60,
    width: 300,
    left: "13%",
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
