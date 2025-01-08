import React from 'react';
import { Stack } from 'expo-router';

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="createGoal" options={{ headerShown: false }} />
      <Stack.Screen name="yourGoal" options={{ headerShown: false }} />
      <Stack.Screen name="goal/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="goal/complete" options={{ headerShown: false }} />
      <Stack.Screen name="goal/inprogress" options={{ headerShown: false }} />
      <Stack.Screen name="goal/fail" options={{ headerShown: false }} />
      <Stack.Screen name="goal/create/[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;