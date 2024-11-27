import React, {useEffect, useState} from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SocketProvider } from "../../context/socket.js"; // Adjust path as necessary
import Header from "../header.jsx";  // Ensure path is correct

import { auth } from '../../global/global.js';
import { getUserdetail } from '../../serverRequest.js';

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: 70,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#CC2B52',
    padding: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 35,
    shadowColor: '#D4BEE4',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    height: 70,
    width: 83,
    fontSize: 12,
  },
  inactiveTab: {
    padding: 10,
  },
});

const Layout = () => {
  const [userDetails, setUserDetails] = useState({});
  const _id = auth.id

  const fetchgetUserdetail = async () => {
    try {
      const Response = await getUserdetail(_id);
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

            if (route.name === 'chequedetail') {
              iconName = 'money-check-alt';
            } else if (route.name === 'chequestatus') {
              iconName = 'user-friends';
            } else if (route.name === 'notification') {
              iconName = 'bell';
            }

            return (
              <View style={[styles.tabItem, iconStyle]}>
                <FontAwesome5 name={iconName} size={22} color={focused ? '#ffffff' : color} />
                <Text style={{ color: focused ? '#ffffff' : color, fontSize: 12, marginTop: 5 }}>
                  {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerShown: false
        })}
      >
        <Tabs.Screen
          name="chequedetail"
          options={{
            title: '',
            headerShown: false, // Hide the top header (navbar)
          }}
        />
        <Tabs.Screen
          name="memberscheque"
          options={{
            title: 'Members Cheque',
            headerShown: false, // Hide the top header (navbar)
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: 'Notification',
            headerShown: false, // Hide the top header (navbar)
          }}
        />
      </Tabs>
    </SocketProvider>

  );
};

export default Layout;