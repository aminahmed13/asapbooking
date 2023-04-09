import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import CustomButton from "../components/CustomButton";
import { useState } from "react";

const TicketInfoScreen = ({ route, navigation }) => {
  const [turn, setTurn] = useState(false);
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
      headerTitle: "Your Ticket",
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

  const handleCancelTicket = () => {
    console.log("cancel ticket");
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
          marginTop: 30,
          // flex: 1,

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#5e17eb",
            fontSize: 18,
          }}
        >
          Your Queue Number
        </Text>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 35,
          }}
        >
          A305
        </Text>
      </View>
      <View style={styles.ticketDetailsContainer}>
        <View style={styles.ticketDetails}>
          <Text style={styles.label}>Now Serving</Text>
          <Text style={styles.info}>A304</Text>
        </View>
        <View style={styles.ticketDetails}>
          <Text style={styles.label}>Estimated Call Time</Text>
          <Text style={styles.info}>3 min</Text>
        </View>
        <View style={styles.ticketDetails}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.info}>Add/Drop</Text>
        </View>
      </View>

      <View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#36db28",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Your turn has reached. Please proceed to counter
          </Text>
          <Text>2</Text>
        </View>
        <View
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
              <Icon name="check" color="white" size={30} />
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
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cancel Ticket"
          onPress={handleCancelTicket}
          buttonColor="#ff0505"
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
    marginHorizontal: 100,
    marginBottom: 20,
  },
  label: {
    color: "#828181",
  },
  info: {
    color: "#5e17eb",
  },
  ticketDetailsContainer: {
    marginTop: 50,

    justifyContent: "center",
  },
  buttonContainer: {
    marginHorizontal: 50,
    marginTop: 200,
  },
});
