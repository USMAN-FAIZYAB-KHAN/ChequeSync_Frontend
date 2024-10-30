import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent', // Use gradient background
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
  return (
    <LinearGradient
      colors={['#000000', '#3C3D37']} // Example new colors
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            let iconStyle = focused ? styles.activeTab : styles.inactiveTab;

            // Assign icon names based on route name
            if (route.name === 'signin') {
              iconName = "sign-in-alt"; // FontAwesome icon for sign in
            } else if (route.name === 'signup') {
              iconName = "user-plus"; // FontAwesome icon for sign up
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
          tabBarShowLabel: false, // Label is custom-rendered inside icon
        })}
      >
        <Tabs.Screen
          name="signin"
          options={{ title: 'Sign In' }}
        />
        <Tabs.Screen
          name="signup"
          options={{ title: 'Sign Up' }}
        />
      </Tabs>
    </LinearGradient>
  );
};

export default Layout;
