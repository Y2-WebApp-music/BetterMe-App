import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { AddIcon, LeftArrowIcon } from '../../../constants/icon'
import { useAuth } from '../../../context/authContext'
import BackButton from '../../../components/Back'

const YourGoal = () => {

  const { user } = useAuth()

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:20}}
          showsVerticalScrollIndicator={false}
        >
          <BackButton goto={'/home'}/>
          <View className='mt-2'>
            <View className='flex flex-row gap-2 items-center'>
              <View className='grow'>
                <Text className='text-subTitle text-primary font-notoMedium'>Your goal</Text>
              </View>
              <View>
                <TouchableOpacity onPress={()=>{router.replace('/home/createGoal')}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
                  <Text className='text-body text-white font-notoMedium'>New Goal</Text>
                  <AddIcon width={22} height={22} color={'white'}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default YourGoal