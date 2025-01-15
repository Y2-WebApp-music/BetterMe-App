import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { ForwardIcon, UserIcon } from '../../../constants/icon'
import { Image } from 'expo-image';
import { useAuth } from '../../../context/authContext';
import SleepSummary from '../../../components/sleep/sleepSummary';
import SleepToday from '../../../components/sleep/sleepToday';
import FoodSummary from '../../../components/food/foodSummary';
import FoodToday from '../../../components/food/foodToday'


const screenWidth = Dimensions.get('window').width;

const Menu = () => {

  const { user } = useAuth();

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          <View className='mb-4 flex flex-row gap-2 items-center'>
            <View className='grow'>
              <Text className='text-heading2 font-notoMedium'>{user?.displayName}</Text>
              <Text className='text-subText font-noto'>{user?.email}</Text>
            </View>
            <View className='overflow-hidden rounded-full'>
              <Image
                style={styles.image}
                source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
                contentFit="cover"
                transition={1000}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={()=>{router.push('/menu/account')}}
            className="flex flex-row gap-2 items-center justify-center rounded-normal border border-gray p-2 px-4 bg-red-500"
          >
            <UserIcon width={30} height={30} color={'#626262'}/>
            <Text className="text-subText text-heading2 grow font-noto">account setting</Text>
            <ForwardIcon width={30} height={30} color={'#CFCFCF'}/>
          </TouchableOpacity>
          <View className='my-3'>
            <View className='flex flex-row gap-2 items-center'>
              <View className='grow'>
                <Text className='text-heading2 font-noto'>your sleep</Text>
              </View>
            <View>
            <TouchableOpacity className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>view all sleep</Text>
            </TouchableOpacity>
            </View>
          </View>
          </View>
          <SleepSummary />
          <Text className='text-subText my-2'>last night : 23 May 2024</Text>
          <SleepToday />

          <View className='my-3'>
            <View className='flex flex-row gap-2 items-center'>
              <View className='grow'>
                <Text className='text-heading2 font-noto'>your meal</Text>
              </View>
            <View>
            <TouchableOpacity className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>view all meal</Text>
            </TouchableOpacity>
            </View>
          </View>
          </View>
          <FoodSummary/>
          <Text className='text-subText my-2'>today : 23 May 2024</Text>
          <FoodToday/>

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

export default Menu