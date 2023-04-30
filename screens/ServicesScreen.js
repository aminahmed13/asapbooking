import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ServiceOption from "../components/ServiceOption";
import Icon from "react-native-vector-icons/FontAwesome";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

const ServicesScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [services, setServices] = useState([]);

  // i used this to get the displayName of the current user
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (authUser) => {
  //     if (authUser) {
  //       setUserName(authUser.displayName);
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

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

  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "100%",
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
    </View>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({});
