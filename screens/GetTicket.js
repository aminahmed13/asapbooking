import { StyleSheet, Text, TextInput, View } from "react-native";
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
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const GetTicket = ({ route }) => {
  const [comment, setComment] = useState("");
  const [customerId, setCustomerId] = useState("");
  const navigation = useNavigation();
  const { serviceId, serviceName, task_completion_time } = route.params;
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
  useEffect(() => {
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      snapshot.docs.map((doc) => {
        console.log(doc.id, doc.data());
      });
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: serviceName,
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

  const handleGetTicket = () => {
    addDoc(colRef, {
      customerId: customerId,
      serviceId: serviceId,
      comments: comment,
      estimated_call_time: task_completion_time,
      timestamp: serverTimestamp(),
      status: "waiting",
    }).then(() => {
      setComment("");
      navigation.navigate("TicketInfo");
    });
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
        />
      </View>
      <View
        style={{
          marginHorizontal: 50,
          marginTop: 200,
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
