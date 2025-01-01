import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const CameraLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="takePhoto" options={{ headerShown: false }} />
    </Stack>
  )
}

export default CameraLayout