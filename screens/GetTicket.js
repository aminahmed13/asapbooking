import { StyleSheet, Text, View } from "react-native";
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
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const GetTicket = ({ route }) => {
  const [comment, setComment] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [tickets, setTickets] = useState([]);
  const [waitingTickets, setWaitingTickets] = useState([]);
  const navigation = useNavigation();
  const { serviceId, serviceName, task_completion_time, letter } = route.params;
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((err) => {
        alert(err);
      });
  };

  const colRef = collection(db, "tickets");
  const q = query(
    colRef,
    where("serviceId", "==", serviceId),
    orderBy("timestamp")
  );

  const q_waiting = query(
    colRef,
    where("status", "==", "waiting"),
    where("serviceId", "==", serviceId),
    orderBy("timestamp")
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTickets(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    const unsubscribe1 = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setCustomerId(authUser.uid);
      }
    });

    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, []);

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

  // let queueNumber;
  // useEffect(() => {
  //   console.log(waitingTickets.length);
  //   queueNumber = waitingTickets.length;
  // }, [waitingTickets]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: serviceName.toUpperCase(),
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

  const handleGetTicket = () => {
    // console.log(queueNumber, comment);
    addDoc(colRef, {
      customerId: customerId,
      serviceId: serviceId,
      comments: comment,
      estimated_call_time: task_completion_time,
      timestamp: serverTimestamp(),
      status: "waiting",
      ticketNumber: letter + (tickets.length + 1),
      // queueNumber: queueNumber + 1,
    }).then((docRef) => {
      setComment("");
      console.log(docRef.id);
      navigation.navigate("TicketInfo", {
        ticketId: docRef.id,
        serviceId: serviceId,
        serviceName: serviceName,
        task_completion_time: task_completion_time,
      });
    });
  };

  // const [currentTicket, setCurrentTicket] = useState(null);
  // useEffect(() => {
  //   if (tickets.length > 0) {
  //     setCurrentTicket(waitingTickets[0]);
  //     setWaitingTickets(waitingTickets.slice(1));
  //   } else {
  //     setCurrentTicket(null);
  //     setWaitingTickets([]);
  //   }
  // }, [tickets]);

  // // temp
  // const handleCallNextTicket = () => {
  //   if (currentTicket) {
  //     const ticketRef = doc(colRef, currentTicket.id);
  //     updateDoc(ticketRef, { status: "done" })
  //       .then(() => {
  //         setCurrentTicket(waitingTickets[0]);
  //         setWaitingTickets(waitingTickets.slice(1));
  //       })
  //       .catch((error) => {
  //         console.log("Error updating ticket: ", error);
  //       });
  //   }
  // };

  // // display current ticket
  // useEffect(() => {
  //   console.log(currentTicket);
  // }, [currentTicket]);
  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "100%",
        position: "relative",
      }}
    >
      <View
        style={{
          marginTop: 50,
          marginHorizontal: 20,
        }}
      >
        <CustomInput
          multiline={true}
          numberOfLines={4}
          placeholder="If there is anything you want your advisor to know in advance, please type it here"
          value={comment}
          onChangeText={setComment}
          keyboardType="default"
          autoCapitalize="none"
          label="Comments"
          returnKeyType="done"
          textAlignVertical="top"
        />
      </View>
      <View
        style={{
          // marginHorizontal: 50,
          // marginTop: 200,
          position: "absolute",
          bottom: 60,
          width: 300,
          left: "13%",
        }}
      >
        <CustomButton
          title="Get Ticket"
          onPress={handleGetTicket}
          buttonColor="#42e134"
        />
      </View>
    </View>
  );
};

export default GetTicket;

const styles = StyleSheet.create({});
