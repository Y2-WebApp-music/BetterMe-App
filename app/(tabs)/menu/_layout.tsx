import React from 'react';
import { Stack } from 'expo-router';

const MenuLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MenuLayout;