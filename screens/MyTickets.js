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

import { ButtonGroup } from "@rneui/themed";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

const MyTickets = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigation = useNavigation();

  const [customerId, setCustomerId] = useState("");
  const [myTickets, setMyTickets] = useState([]);

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

  useEffect(() => {
    const colRef = collection(db, "tickets");

    // tickets
    const q = query(
      colRef,
      where("customerId", "==", customerId),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyTickets(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, [customerId]);

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
      headerTitle: `MY TICKETS`,
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

  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <ButtonGroup
        buttons={["All", "Waiting", "Done"]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
        containerStyle={{ marginVertical: 20, borderRadius: 10 }}
        selectedButtonStyle={{
          backgroundColor: "#5e17eb",
        }}
      />
      {selectedIndex == 0 && (
        <View
          style={{
            height: "100%",
          }}
        >
          {myTickets.length === 0 ? (
            <Text>No tickets to show here</Text>
          ) : (
            <FlatList
              data={myTickets}
              renderItem={({ item }) => (
                <View style={styles.myTicketItem}>
                  <Text style={styles.ticketNumber}>
                    {item.data.ticketNumber}
                  </Text>
                  <Text>Status: {item.data.status}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      )}

      {/* status == waiting */}
      {selectedIndex == 1 && (
        <View
          style={{
            height: "100%",
          }}
        >
          {myTickets.length === 0 ? (
            <Text>No tickets to show here</Text>
          ) : (
            <FlatList
              data={myTickets.filter((item) => item.data.status === "waiting")}
              renderItem={({ item }) => (
                <View style={styles.myTicketItem}>
                  <Text style={styles.ticketNumber}>
                    {item.data.ticketNumber}
                  </Text>
                  <Text>Status: {item.data.status}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      )}

      {/* status == done */}
      {selectedIndex == 2 && (
        <View
          style={{
            height: "100%",
          }}
        >
          {myTickets.length === 0 ? (
            <Text>No tickets to show here</Text>
          ) : (
            <FlatList
              data={myTickets.filter((item) => item.data.status === "done")}
              renderItem={({ item }) => (
                <View style={styles.myTicketItem}>
                  <Text style={styles.ticketNumber}>
                    {item.data.ticketNumber}
                  </Text>
                  <Text>Status: {item.data.status}</Text>
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

export default MyTickets;

const styles = StyleSheet.create({
  myTicketItem: {
    marginBottom: 5,
    backgroundColor: "#f1f3f5",
    padding: 10,
    alignItems: "flex-start",
    borderRadius: 20,
    paddingLeft: 30,
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
