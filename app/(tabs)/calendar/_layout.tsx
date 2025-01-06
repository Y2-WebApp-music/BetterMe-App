import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const CalendarLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, animation:'none' }} />
      <Stack.Screen name="weekCalendar" options={{ headerShown: false, animation:'none' }} />
      <Stack.Screen name="meal/[id]" options={{ headerShown: false, animation:'flip' }} />
    </Stack>
  )
}

export default CalendarLayout