import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Calendar = () => {
  return (
    <Stack>
      <Stack.Screen name="weekCalendar" options={{ headerShown: false }} />
      <Stack.Screen name="monthCalendar" options={{ headerShown: false }} />
    </Stack>
  )
}

export default Calendar