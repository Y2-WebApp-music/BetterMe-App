import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { useAuth } from '../../../context/authContext';
import BackButton from '../../../components/Back';
import { LeftArrowIcon } from '../../../constants/icon';
import { router } from 'expo-router';

const AccountSetting = () => {

  const { signOut } = useAuth(); // Access signOut function

  const handleSignOut = async () => {
    await signOut();
  };


  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <ScrollView
            className='w-[92%] h-auto'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode='on-drag'
          >
            <TouchableOpacity onPress={()=>{router.replace('./');}} className=" will-change-contents w-fit flex flex-row items-center justify-start">
              <View>
                <LeftArrowIcon width={14} height={14} color={"black"} />
              </View>
              <Text>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignOut}
              className="flex flex-row items-center justify-center rounded-normal border border-gray p-1 px-4 bg-red-500 mt-6"
            >
              <Text className="text-subText text-heading2 font-notoMedium">Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AccountSetting