import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import BackButton from '../../components/Back'

const forgetPassword = () => {
  return (
    <SafeAreaView>
      <BackButton/>
      <Text>forgetPassword</Text>
    </SafeAreaView>
  )
}

export default forgetPassword