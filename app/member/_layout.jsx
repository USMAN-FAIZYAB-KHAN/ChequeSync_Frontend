import React, { useEffect, useState } from "react";
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SocketProvider } from "../../context/socket.js";
import Header from "../header.jsx";
import { getUserdetail } from "../../serverRequest.js";
import { auth } from "../../global/global.js";
import { LinearGradient } from 'expo-linear-gradient'; // For gradient effect

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: 80,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    paddingBottom: 5,
    borderRadius: 25, // Smooth edges for the whole bar
    marginHorizontal: 10, // To make the tab bar look less crowded
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#CC2B52',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#D4BEE4',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    height: 70,
    width: 90,
    fontSize: 14,
    marginTop: -10, // Slight lift effect
  },
  inactiveTab: {
    padding: 15,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  iconStyle: {
    marginBottom: 5,
  },
});

const Layout = () => {
  const [userDetails, setUserDetails] = useState({});
  const _id = auth.id
  const accessToken = auth.accessToken

  const fetchgetUserdetail = async () => {
    console.log("SSS")
    try {
      const Response = await getUserdetail(_id, accessToken);
      const user = Response.data.user;
      
      setUserDetails({
        userId: user._id,
        Type: user.type,
        username: `${user.firstName} ${user.lastName}`,
        email: user.userEmail,
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchgetUserdetail();
  }, []);

  return (
    <SocketProvider>
      {Object.keys(userDetails).length > 0 && (
        <Header userDetails={userDetails} />
      )}

      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            let iconStyle = focused ? styles.activeTab : styles.inactiveTab;

            if (route.name === 'cheque') {
              iconName = "money-check-alt";
            } else if (route.name === 'upload') {
              iconName = "cloud-upload-alt";
            } else if (route.name === 'notification') {
              iconName = "bell";
            }

            return (
              <View style={[styles.tabItem, iconStyle]}>
                <FontAwesome5
                  name={iconName}
                  size={22}
                  color={focused ? '#ffffff' : color}
                  style={styles.iconStyle}
                />
                <Text style={[styles.tabText, { color: focused ? '#ffffff' : color }]}>
                  {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true, // Show labels now
          headerShown: false,
        })}
      >
        <Tabs.Screen
          name="cheque"
          options={{ title: 'Cheque' }}
        />
        <Tabs.Screen
          name="upload"
          options={{ title: 'Upload' }}
        />
        <Tabs.Screen
          name="notification"
          options={{ title: 'Notification' }}
        />
      </Tabs>
    </SocketProvider>
  );
};

export default Layout;
