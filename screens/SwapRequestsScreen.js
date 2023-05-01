import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { Button } from "@rneui/base";
import { ButtonGroup } from "@rneui/themed";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

const SwapRequestsScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigation = useNavigation();
  const [swapRequests, setSwapRequests] = useState([]);
  const [mySwapRequests, setMySwapRequests] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [showRequesed, setShowRequested] = useState(true);

  // customer id
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log(customerId);
        setCustomerId(authUser.uid);
      }
    });

    return unsubscribe;
  }, []);

  // swapRequests collection
  useEffect(() => {
    const swapColRef = collection(db, "swapRequests");

    // ppl requesting to swap their tickets with me
    const q = query(
      swapColRef,
      where("requestedUserId", "==", customerId),
      where("status", "==", "pending")
    );

    //my requests to swap tickets with others
    const q2 = query(swapColRef, where("requesterId", "==", customerId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSwapRequests(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    const unsubscribe1 = onSnapshot(q2, (snapshot) => {
      setMySwapRequests(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => {
      unsubscribe(), unsubscribe1();
    };
  }, [customerId]);

  console.log(swapRequests);
  console.log(mySwapRequests);
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
      headerTitle: `SWAP REQUESTS`,
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
  const swapColRef = collection(db, "swapRequests");
  const servicesColRef = collection(db, "services");

  const handleAcceptSwapRequest = (
    id,
    requesterID,
    requesterTicketId,
    requestedTicketId
  ) => {
    console.log(id, requesterID, requestedTicketId);
    console.log("accepted");
    const swapRequestId = doc(swapColRef, id);

    updateDoc(swapRequestId, {
      status: "accepted",
    })
      .then(() => {
        // change ticket numbers
        const batch = writeBatch(db);

        //ticket ids
        const requesterTicketRef = doc(colRef, requesterTicketId);
        const requestedTicketRef = doc(colRef, requestedTicketId);

        // swapping the ids using batch
        batch.update(requesterTicketRef, { customerId: requestedTicketId });
        batch.update(requestedTicketRef, { customerId: requesterID });

        batch
          .commit()
          .then(() => {
            console.log("Tickets swapped successfully!");
          })
          .catch((error) => {
            console.error("Error swapping tickets:", error);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleRejectSwapRequest = (id) => {
    console.log("rejected", id);
    const swapRequestId = doc(swapColRef, id);

    updateDoc(swapRequestId, {
      status: "rejected",
    }).catch((err) => {
      console.log(err.message);
    });
  };

  const handleTicketClick = (requestedTicketId) => {
    const TicketRef = doc(colRef, requestedTicketId);
    let serviceId;
    let service_name;
    let task_completion_time;
    getDoc(TicketRef)
      .then((data) => {
        serviceId = data.data().serviceId;
        console.log(serviceId);
        const ServiceRef = doc(servicesColRef, serviceId);

        getDoc(ServiceRef)
          .then((doc) => {
            service_name = doc.data().service_name;
            task_completion_time = doc.data().task_completion_time;
            // console.log(serviceId, service_name, task_completion_time);
            navigation.navigate("TicketInfo", {
              ticketId: requestedTicketId,
              serviceId: serviceId,
              serviceName: service_name,
              task_completion_time: task_completion_time,
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        console.log("err, ", err.message);
      });
  };
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <ButtonGroup
        buttons={["My Requests", "Requesting me"]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
        containerStyle={{ marginVertical: 20, borderRadius: 10 }}
        selectedButtonStyle={{
          backgroundColor: "#5e17eb",
        }}
      />
      {selectedIndex == 1 && (
        <View
          style={{
            height: "100%",
          }}
        >
          {swapRequests.length === 0 ? (
            <Text>No pending swap requests</Text>
          ) : (
            <FlatList
              data={swapRequests}
              renderItem={({ item }) => (
                <View style={styles.swapRequestItem}>
                  <Text>{`User ${item.data.requesterId.slice(
                    0,
                    5
                  )} wants to swap ticket with you.`}</Text>
                  <View style={styles.buttonsContainer}>
                    {/* buttons container */}
                    <Button
                      radius={"lg"}
                      type="solid"
                      color={"#40c057"}
                      title="Accept"
                      titleStyle={{ color: "#f8f9fa", fontWeight: 700 }}
                      onPress={() =>
                        handleAcceptSwapRequest(
                          item.id,
                          item.data.requesterId,
                          item.data.requesterTicketId,
                          item.data.requestedTicketId
                        )
                      }
                    />
                    <Button
                      radius={"lg"}
                      type="solid"
                      color={"#ff0505"}
                      titleStyle={{ color: "#343a40", fontWeight: 700 }}
                      title="Reject"
                      onPress={() => handleRejectSwapRequest(item.id)}
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      )}
      {selectedIndex == 0 && (
        <View
          style={{
            height: "100%",
          }}
        >
          {mySwapRequests.length === 0 ? (
            <Text>No pending swap requests</Text>
          ) : (
            <FlatList
              data={mySwapRequests}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 5,
                    backgroundColor: "#f1f3f5",
                    padding: 10,
                    alignItems: "center",
                    borderRadius: 20,
                    justifyContent: "center",
                    paddingHorizontal: 30,
                  }}
                >
                  <View style={styles.mySwapRequestItem}>
                    <View style={styles.ticketNumberContainer}>
                      <Text style={styles.ticketNumber}>
                        {item.data.requesterTicketNumber}
                      </Text>
                      <AntDesign name="swap" color="black" size={30} />
                      <Text style={styles.ticketNumber}>
                        {item.data.requestedTicketNumber}
                      </Text>
                    </View>
                    <View style={styles.statusContainer}>
                      <Text style={{}}>Status: </Text>
                      <Text style={{}}>{item.data.status} </Text>
                    </View>
                  </View>
                  {item.data.status == "accepted" && (
                    <TouchableOpacity
                      onPress={() =>
                        handleTicketClick(item.data.requestedTicketId)
                      }
                      style={{}}
                    >
                      <FontAwesome name="ticket" size={34} color="#5e17eb" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default SwapRequestsScreen;

const styles = StyleSheet.create({
  swapRequestItem: {
    marginBottom: 5,
    backgroundColor: "#f1f3f5",
    padding: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  mySwapRequestItem: {
    flex: 1,
  },
  ticketNumberContainer: {
    flexDirection: "row",
  },
  statusContainer: {
    flexDirection: "row",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 30,
    justifyContent: "center",
    marginTop: 10,
  },
  ticketNumber: {
    fontSize: 20,
    fontWeight: 700,
  },
});
