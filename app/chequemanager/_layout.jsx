import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { SocketProvider } from "../../context/socket.js"; // Adjust path as necessary
import Header from "../header.jsx";  // Ensure path is correct
import { auth } from '../../global/global.js';
import { getUserdetail } from '../../serverRequest.js';
import TabBar from "../../components/TabBar.jsx";

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
      <Tabs tabBar={props => <TabBar {...props}/>}>
        <Tabs.Screen
          name="chequedetail"
          options={{ title: 'Cheque Detail', headerShown: false, fontSize: "font-md", color: "text-green-600", underlineColor: "bg-green-100" }}
        />
        <Tabs.Screen
          name="chequestatus"
          options={{ title: 'Cheque Status', headerShown: false, fontSize: "font-md", color: "text-green-600", underlineColor: "bg-green-600" }}
        />
        <Tabs.Screen
          name="addUserForm"
          options={{ title: 'Add Member', headerShown: false, fontSize: "font-md", color: "text-green-600", underlineColor: "bg-green-600" }}
        />
        <Tabs.Screen
          name="notification"
          options={{ title: 'Notification', headerShown: false, fontSize: "font-md", color: "text-green-600", underlineColor: "bg-green-600" }}
        />
      </Tabs>
    </SocketProvider>
  );
};

export default Layout;
