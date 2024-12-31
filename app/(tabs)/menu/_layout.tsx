import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '../../../context/authContext';

const Menu = () => {

  const { signOut } = useAuth(); // Access signOut function

  const handleSignOut = async () => {
    await signOut();
  };


  return (
    <SafeAreaView>
      <Text>Menu</Text>
      <TouchableOpacity
                onPress={handleSignOut}
                className="flex flex-row items-center justify-center rounded-full p-1 px-4 bg-red-500 mt-6"
              >
                <Text className="text-white text-heading2 font-notoMedium">Sign Out</Text>
              </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Menu