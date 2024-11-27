import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Header = ({ userDetails }) => {
  const router = useRouter();

  const { userId, Type, username, email } = userDetails; 
  
  const handleProfileClick = () => {
    console.log("ashik")
    router.push({
      pathname: "/userProfile",
      params: { userId, Type, username, email }, 
    });
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 10 , alignItems: 'center'}}>
      <TouchableOpacity onPress={handleProfileClick}>
        <Text style={{ fontSize: 18, marginRight: 10, color: '#888', textTransform: 'capitalize' }}>
          {username || "Loading..."}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleProfileClick}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
