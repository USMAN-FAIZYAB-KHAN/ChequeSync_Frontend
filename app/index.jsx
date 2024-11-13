import { View, Text } from 'react-native'
import { Redirect } from 'expo-router';
import React from 'react'

const index = () => {

  if (true) {

    // return <Redirect href="/branchmanager/chequedetail" />;
    
    return <Redirect href="/(auth)/signup" />;
  }

  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index