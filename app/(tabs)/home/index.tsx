import { View, Text, ScrollView, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { User, UserCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../context/authContext';
import { AddIcon } from '../../../constants/icon';
import { router } from 'expo-router';
import PickDateModal from '../../../components/modal/PickDateModal';

// Hi test a review

const screenWidth = Dimensions.get('window').width;

const Home = () => {

  const { user } = useAuth();

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:14}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          {/*
          =============================
          ======== User Title ========
          =============================
          */}
          <View className='mb-4 flex flex-row gap-2 items-center'>
            <View className='overflow-hidden rounded-full'>
              <Image
                style={styles.image}
                source={require('../../../assets/maleAvatar.png')}
                contentFit="cover"
                transition={1000}
              />
            </View>
            <View className='grow'>
              <Text className='text-heading2 font-notoMedium'>{user?.displayName}</Text>
              <Text className='text-subText font-noto'>{user?.email}</Text>
            </View>
          </View>

          {/*
          =============================
          ======== Today Quest ========
          =============================
          */}
          <View className='flex-col gap-2'>
            <View className='w-full flex-row gap-2 '>
              <Text className='grow font-noto'>Today</Text>
              <Text className='text-subText font-noto'>
                {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
              </Text>
            </View>
            <View className='h-28 w-full bg-white rounded-normal border border-gray p-2 justify-center items-center'>
              <Text>Food Today Card</Text>
            </View>
            <View className='h-28 w-full bg-white rounded-normal border border-gray p-2 justify-center items-center'>
              <Text>Sleep last night Card</Text>
            </View>
          </View>

          {/*
          =============================
          ======== Goal Today ========
          =============================
          */}
          <View className='mt-3 pb-16'>
            <View className='flex flex-row gap-2 items-center'>
              <View className='grow'>
                <Text className='text-heading2 font-noto'>Goals Today</Text>
                <Text className='text-body font-noto'>3 inprogress</Text>
              </View>
              <View>
                <TouchableOpacity onPress={()=>{router.replace('/home/createGoal')}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
                  <Text className='text-heading2 text-white font-notoMedium'>New Goal</Text>
                  <AddIcon width={26} height={26} color={'white'}/>
                </TouchableOpacity>
              </View>
            </View>

            <View className='mt-2 flex-col gap-2'>
              {goalData.map((data,i)=>(
                <View key={i} className='h-32 w-full bg-white rounded-normal border border-gray p-2 justify-center items-center'>
                  <Text>Goal Card</Text>
                </View>
              ))}
              <View className='flex-1 justify-center items-center'>
                <TouchableOpacity onPress={()=>{router.replace('/home/yourGoal')}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
                  <Text className='text-body text-white font-notoMedium'>View all goals</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    width:screenWidth * 0.2,
    height:screenWidth * 0.2,
    alignContent:'center',
  },
});

const goalData = [
  {
    goalName:'title',
    endDate:new Date(),
    task:12,
    currentTask:3,
  },
  {
    goalName:'title',
    endDate:new Date(),
    task:12,
    currentTask:3,
  },
  {
    goalName:'title',
    endDate:new Date(),
    task:12,
    currentTask:3,
  },
]

export default Home