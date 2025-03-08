import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const CommunityLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="userProfile" options={{ headerShown: false }} />
      <Stack.Screen name="post/create" options={{ headerShown: false }} />
      <Stack.Screen name="post/edit/[id]" options={{ headerShown: false }} />
      {/* <Stack.Screen name="post/[id]" options={{ headerShown: false }} /> */}
      <Stack.Screen name="search/index" options={{ headerShown: false }} />
      <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="user/goal/[id]" options={{ headerShown: false }} />
    </Stack>
  )
}

export default CommunityLayout