import { View, Text } from 'react-native'
import React from 'react'

const forgetPassword = () => {
  return (
    <SafeAreaView>
      <BackButton goto={'/welcome'}/>
      <Text>forgetPassword</Text>
    </View>
  )
}

export default forgetPassword