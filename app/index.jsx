import { View, Text } from 'react-native'
import { Redirect } from 'expo-router';
import React from 'react'

const index = () => {

  if (true) {
    return <Redirect href="/member/" />;
  }

  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index