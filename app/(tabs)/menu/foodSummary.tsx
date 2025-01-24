import { View, Text, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import BackButton from '../../../components/Back'
import { router } from 'expo-router'
import { AddIcon } from '../../../constants/icon'

const FoodSummary = () => {
  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <View className='w-[92%]'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/menu'}/>
          </View>
          <View className='mt-2 flex-row justify-center items-center'>
            <View className='grow'>
              <Text className='text-title text-primary font-notoMedium'>your meal</Text>
            </View>
            <View>
              <TouchableOpacity onPress={()=>{router.push('/calendar/addMeal')}} className='rounded-full p-1 px-4 bg-primary flex-row items-center justify-center gap-1'>
                <Text className='text-white font-noto text-heading3'>add meal</Text>
                <AddIcon width={22} height={22} color={'#fff'}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          <Text>Food Summary</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default FoodSummary