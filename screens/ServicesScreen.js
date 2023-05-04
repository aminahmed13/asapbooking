import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ServiceOption from "../components/ServiceOption";
import Icon from "react-native-vector-icons/FontAwesome";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import NotificationBadge from "../components/NotificationBadge";

const ServicesScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [services, setServices] = useState([]);
  const [showBadge, setShowBadge] = useState(true);
  const [customerId, setCustomerId] = useState("");
  const [swapRequests, setSwapRequests] = useState([]);

  // customer id
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setCustomerId(authUser.uid);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const swapColRef = collection(db, "swapRequests");

    // incoming swap requests
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

  useEffect(() => {
    if (swapRequests.length > 0) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  }, [swapRequests]);
  useEffect(() => {
    const colRef = collection(db, "services");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setServices(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

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
      headerTitle: `CHOOSE SERVICE`,
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

  //
  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "100%",
        position: "relative",
      }}
    >
      {services.map((service) => (
        <ServiceOption
          key={service.id}
          serviceId={service.id}
          serviceName={service.data.service_name}
          onPress={() => {
            navigation.navigate("GetTicket", {
              serviceId: service.id,
              serviceName: service.data.service_name,
              task_completion_time: service.data.task_completion_time,
              letter: service.data.letter,
            });
          }}
        />
      ))}

      {/* footer  */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MyTickets");
          }}
        >
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SwapRequests");
          }}
        >
          {showBadge && <NotificationBadge />}
          <AntDesign name="swap" color="black" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
    backgroundColor: "#e9ecef",
  },
});

{
  /* <Ionicons name="home-outline" size={24} color="black" />
        <Ionicons name="search-outline" size={24} color="black" />
        <Ionicons name="person-outline" size={24} color="black" /> */
}
