import { StyleSheet, Text, View, Picker } from "react-native";
import React, { useEffect } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  updateDoc,
  getDoc,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { auth, db, messaging } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const GetTicket = ({ route }) => {
  const [selectedTicket, setTicket] = useState("");
  const [waitingTickets, setWaitingTickets] = useState([]);
  const colRef = collection(db, "tickets");
  const q = query(
    colRef,
    where("status", "==", "waiting"),

    orderBy("timestamp")
  );

  const { ticketId, ticketNumber, customerId } = route.params;

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWaitingTickets(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   console.log(waitingTickets);
  // }, [waitingTickets]);
  // const options = ["Option 1", "Option 2", "Option 3"];

  const navigation = useNavigation();

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((err) => {
        alert(err);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Swap",
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

  // used to fetch the id of the ticket the current user is trying to swap with

  // useEffect(() => {
  //   console.log(selectedTicketId[0]?.data?.customerId);
  // }, [selectedTicketId]);

  const [selectedTicketDetails, setSelectedTicketDetails] = useState([]);

  const handleValueChange = (itemValue, itemIndex) => {
    console.log(itemValue);

    // get ticket details
    const q_requested = query(
      colRef,
      where(ticketNumber, "==", selectedTicket)
    );

    // const doc = doc(db, "")

    let selectedTDetails = [];
    setTicket(itemValue);
    getDocs(colRef)
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data().ticketNumber === itemValue) {
            selectedTDetails.push({
              id: doc.id,
              ...doc.data(),
            });
            setSelectedTicketDetails(selectedTDetails);
            console.log(selectedTDetails[0].ticketNumber);
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleSwap = () => {
    console.log("swap clicked");
    console.log(`userAId: ${customerId}`);
    console.log(`userBId: ${selectedTicketDetails[0].customerId}`);
    console.log(`ticketAId: ${ticketId}`);
    console.log(`ticketBId: ${selectedTicketDetails[0].id}`);

    const swapRequestDocRef = doc(
      colRef,
      ticketId + "/swapRequests/" + customerId
    );

    setDoc(swapRequestDocRef, {
      userAId: customerId,
      userBId: selectedTicketDetails[0].customerId,
      ticketAId: ticketId,
      ticketBId: selectedTicketDetails[0].id,
      status: "pending",
    });

    /*
    const userBTopic = `user_${selectedTicketDetails[0].customerId}`;
    const message = {
      notification: {
        title: "Swap request",
        body: `User ${customerId} wants to swap tickets with you`,
      },
      topic: userBTopic,
    };

    send(message)
      .then(() => {
        console.log(
          `Swap request notification sent to user ${selectedTicketDetails[0].customerId}`
        );
      })
      .catch((error) => {
        console.error("Error sending swap request notification:", error);
      });
     */
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
          marginTop: 50,
          marginHorizontal: 90,
          textAlign: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(94, 23, 235, 0.8)",
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Your ticket is {ticketNumber}
          </Text>
        </View>

        <Text
          style={{
            fontWeight: 500,
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          Select the ticket you want to swap with:
        </Text>
        <Picker
          selectedValue={selectedTicket}
          onValueChange={handleValueChange}
        >
          {waitingTickets.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.data.ticketNumber}
              value={option.data.ticketNumber}
            />
          ))}
        </Picker>
      </View>
      <View
        style={{
          marginHorizontal: 50,
          marginTop: 200,
        }}
      >
        <CustomButton
          title="Request Swap"
          onPress={handleSwap}
          buttonColor="#5e17eb"
        />
      </View>
    </View>
  );
};

export default GetTicket;

const styles = StyleSheet.create({});
