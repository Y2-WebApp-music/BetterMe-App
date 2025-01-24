import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import { router } from 'expo-router'
import { AddIcon, ForwardIcon, UserIcon } from '../../../constants/icon'
import { Image } from 'expo-image';
import { useAuth } from '../../../context/authContext';
import SleepSummary from '../../../components/sleep/sleepSummaryCard';
import SleepToday from '../../../components/sleep/sleepToday';
import FoodSummary from '../../../components/food/foodSummaryCard';
import FoodToday from '../../../components/food/foodToday'
import { RefreshControl } from 'react-native';


const screenWidth = Dimensions.get('window').width;

const Menu = () => {

  const { user } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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

          <View className='mt-2 items-center'>
            <View className='mb-1 w-full items-start'>
              <View className='flex flex-row gap-2 items-center'>
                <View className='grow'>
                  <Text className='text-heading3 font-noto'>Personal info</Text>
                </View>
              </View>
            </View>
            <View className='w-[96%] justify-center items-center flex-row gap-1'>
              <View className=' rounded-normal border border-gray py-1 px-4 bg-white h-[4.5rem] justify-center'>
                <View style={{ transform: [{ translateY: 2 }]}}>
                  <Text className='text-subText font-noto'>weight</Text>
                </View>
                <View className='flex-row gap-1 items-end'>
                  <Text className='text-green text-heading font-notoMedium'>333.3</Text>
                  <View style={{ transform: [{ translateY: -6 }] }}>
                    <Text className='text-subText font-noto text-detail'>kg</Text>
                  </View>
                </View>
              </View>
              <View className=' rounded-normal border border-gray py-1 px-4 bg-white h-[4.5rem] justify-center'>
                <View style={{ transform: [{ translateY: 2 }] }}>
                  <Text className='text-subText font-noto'>height</Text>
                </View>
                <View className='flex-row gap-1 items-end'>
                  <Text className='text-green text-heading font-notoMedium'>333.3</Text>
                  <View style={{ transform: [{ translateY: -6 }] }}>
                    <Text className='text-subText font-noto text-detail'>cm</Text>
                  </View>
                </View>
              </View>
              <View className=' rounded-normal border border-gray py-1 px-4 bg-white h-[4.5rem] min-w-[9rem] justify-center'>
                <Text className='text-subText font-noto'>activity</Text>
                <View className='items-center'>
                  <Text className='text-primary text-heading2 font-notoMedium'>Moderately</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{height:1, width:'100%'}} className=' bg-gray my-3'/>

          <View className=' items-center'>
            <View className='mb-1 w-full items-start'>
              <View className='flex flex-row gap-2 items-center'>
                <View className='grow'>
                  <Text className='text-heading3 font-noto'>Goals</Text>
                </View>
                <View>
                  <TouchableOpacity onPress={()=>{router.push('/home/yourGoal')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
                    <Text className='text-body text-white font-notoMedium'>view all goal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className='w-full justify-center items-center flex-row gap-1'>
              <View className='mt-1 w-full flex-row gap-1 items-center justify-center'>
                <TouchableOpacity onPress={()=>{router.push('/home/goal/complete')}} className='flex-col p-1 px-2 h-[4.5rem] rounded-normal bg-white border border-gray items-center justify-center'>
                  <View style={{ transform: [{ translateY: 2 }] }}>
                    <Text className='font-noto text-body text-subText'>complete</Text>
                  </View>
                  <Text className='text-heading font-notoMedium text-green'>33</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{router.push('/home/goal/inprogress')}} className='flex-col p-1 px-2 h-[4.5rem] rounded-normal bg-white border border-gray items-center justify-center'>
                  <View style={{ transform: [{ translateY: 2 }] }}>
                    <Text className='font-noto text-body text-subText'>in complete</Text>
                  </View>
                  <Text className='text-heading font-notoMedium text-yellow'>33</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{router.push('/home/goal/fail')}} className='flex-col p-1 px-4 h-[4.5rem] rounded-normal bg-white border border-gray items-center justify-center'>
                  <View style={{ transform: [{ translateY: 2 }] }}>
                    <Text className='font-noto text-body text-subText'>failed</Text>
                  </View>
                  <Text className='text-heading font-notoMedium text-red'>33</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{router.push('/home/createGoal')}} className='flex-col p-1 px-2 h-[4.5rem] rounded-normal bg-white border border-gray items-center justify-center'>
                  <AddIcon width={30} height={30} color={'#1c60de'}/>
                  <Text className='text-body font-noto text-subText'>new goal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{height:1, width:'100%'}} className=' bg-gray my-3'/>

          <View className='mb-3'>
            <View className='flex flex-row gap-2 items-center'>
              <View className='grow'>
                <Text className='text-heading3 font-noto'>your sleep</Text>
              </View>
            <View>
              <TouchableOpacity onPress={()=>{router.push('/menu/sleepSummary')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
                <Text className='text-body text-white font-notoMedium'>view all sleep</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
          <SleepSummary />
          <Text className='text-subText my-2'>last night : 23 May 2024</Text>
          <SleepToday />

          <View style={{height:1, width:'100%'}} className=' bg-gray my-3'/>

          <View className='mb-3'>
            <View className='flex flex-row gap-2 items-center'>
              <View className='grow'>
                <Text className='text-heading3 font-noto'>your meal</Text>
              </View>
            <View>
            <TouchableOpacity onPress={()=>{router.push('/menu/foodSummary')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>view all meal</Text>
            </TouchableOpacity>
            </View>
          </View>
          </View>
          <FoodSummary/>
          <Text className='text-subText my-2'>today : 23 May 2024</Text>
          <FoodToday/>
          <View className='pb-20'></View>

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