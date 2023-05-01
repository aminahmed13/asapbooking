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

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

const SwapRequestsScreen = () => {
  const navigation = useNavigation();
  const [swapRequests, setSwapRequests] = useState([]);
  const [customerId, setCustomerId] = useState("");

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

    const q = query(
      swapColRef,
      where("requestedUserId", "==", customerId),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSwapRequests(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, [customerId]);

  console.log(swapRequests);
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
      .then((docRef) => {
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
  return (
    <View
      style={{
        backgroundColor: "#fff",
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
                  onPress={
                    () => console.log("rejected")
                    // handleRejectSwapRequest(item.id)
                  }
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default SwapRequestsScreen;

const styles = StyleSheet.create({
  swapRequestItem: {
    // marginHorizontal: 20,
    marginBottom: 5,
    backgroundColor: "#f1f3f5",
    padding: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 30,
    justifyContent: "center",
  },
});
