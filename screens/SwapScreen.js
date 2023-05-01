import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Picker } from "@react-native-picker/picker";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

const SwapScreen = ({ route }) => {
  const [selectedTicket, setTicket] = useState("");
  const [waitingTickets, setWaitingTickets] = useState([]);
  const colRef = collection(db, "tickets");

  const swapColRef = collection(db, "swapRequests");

  const { ticketId, ticketNumber, customerId, serviceId } = route.params;

  const q = query(
    colRef,
    where("status", "==", "waiting"),
    where("serviceId", "==", serviceId),
    orderBy("timestamp")
  );

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
      headerTitle: "SWAP",
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
            console.log(selectedTDetails[0]);
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

    // const swapRequestDocRef = doc(
    //   colRef,
    //   ticketId + "/swapRequests/" + customerId
    // );

    addDoc(swapColRef, {
      requesterId: customerId, //  ID of the current user
      requesterTicketId: ticketId, // ID of the ticket of the requester
      requestedTicketId: selectedTicketDetails[0].id, // ID of the ticket to swap
      requestedUserId: selectedTicketDetails[0].customerId, // ID of the user to swap with
      status: "pending",
    })
      .then((docRef) => {
        console.log(docRef.id);
      })
      .catch((err) => {
        console.log(err.message);
      });

    // setDoc(swapRequestDocRef, {
    //   userAId: customerId,
    //   userBId: selectedTicketDetails[0].customerId,
    //   ticketAId: ticketId,
    //   ticketBId: selectedTicketDetails[0].id,
    //   status: "pending",
    // });

    // /*
    // const userBTopic = `user_${selectedTicketDetails[0].customerId}`;
    // const message = {
    //   notification: {
    //     title: "Swap request",
    //     body: `User ${customerId} wants to swap tickets with you`,
    //   },
    //   topic: userBTopic,
    // };

    // send(message)
    //   .then(() => {
    //     console.log(
    //       `Swap request notification sent to user ${selectedTicketDetails[0].customerId}`
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error sending swap request notification:", error);
    //   });
    // //  */
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        height: "100%",
        position: "relative",
        alignItems: "center",
      }}
    >
      {/* your ticket is badge */}
      <View
        style={{
          backgroundColor: "#5e17eb",
          borderRadius: 10,
          padding: 10,
          marginBottom: 50,
          marginTop: 50,
          marginHorizontal: 30,
          paddingHorizontal: 50,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 18,
          }}
        >
          Your ticket is {ticketNumber}
        </Text>
      </View>

      {/* exchange icon */}
      <View
        style={{
          width: 150,
          height: 150,
          backgroundColor: "#c92a2a",
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 50,
        }}
      >
        <AntDesign name="swap" color="white" size={100} />
      </View>

      <View
        style={{
          marginTop: 10,
          marginHorizontal: 50,
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontWeight: 500,
            fontSize: 20,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Swap with:
        </Text>
        <Picker
          selectedValue={selectedTicket}
          onValueChange={handleValueChange}
          style={{
            width: 200,
            height: 50,
            backgroundColor: "#e9ecef",
          }}
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

      {/* request button */}
      <View
        style={{
          position: "absolute",
          bottom: 60,
          width: 300,
          left: "13%",
        }}
      >
        <CustomButton
          title="Request Swap"
          onPress={handleSwap}
          buttonColor="#5e17eb"
        />
      </View>
    </SafeAreaView>
  );
};

export default SwapScreen;

const styles = StyleSheet.create({});
