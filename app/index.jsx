import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";


const Index = () => {
  const [shouldRedirect, setShouldRedirect] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    console.log("Main layout loaded");

    // Initialize the socket
    const socket = initializeSocket();

    // Listen for socket connection event
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setSocketConnected(true);
    });


  }, []);

  if (shouldRedirect) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <View>
      <Text>Index</Text>
      {/* Example button or logic to trigger redirection */}
      <Text onPress={() => setShouldRedirect(true)}>Go to Signin</Text>

      {/* Display socket connection status */}
      <Text>
        Socket Status: {socketConnected ? "Connected" : "Disconnected"}
      </Text>
    </View>
  );
};

export default Index;
