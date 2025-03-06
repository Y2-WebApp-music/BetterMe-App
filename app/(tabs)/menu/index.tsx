import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { AddIcon, ForwardIcon, UserIcon } from '../../../constants/icon'
import { Image } from 'expo-image';
import { useAuth } from '../../../context/authContext';
import SleepSummary from '../../../components/sleep/weekSleepSummaryCard';
import SleepToday from '../../../components/sleep/sleepToday';
import FoodSummary from '../../../components/food/weekFoodSummaryCard';
import FoodToday from '../../../components/food/foodToday'
import { RefreshControl } from 'react-native';
import { activity } from '../../../types/user';
import { MealSummaryCard } from '../../../types/food';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { toDateId } from '@marceloterreiro/flash-calendar';
import { format, subDays } from 'date-fns';
import { useTheme } from '../../../context/themeContext';

const screenWidth = Dimensions.get('window').width;

const Menu = () => {

  const { colors } = useTheme();
  const { user } = useAuth();
  const today = toDateId(new Date())

  const [mealSummary, setMealSummary] = useState<MealSummaryCard>()
  const [goalCount, setGoalCount] = useState({
    completed: 0,in_progress: 0, failed: 0
  })

  const getSummaryMeal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/calendar/meal/summary/${today}`);
      const data = response.data

      // console.log('calendar/meal/summary \n',data);
      if ( data.message === "No meals found") {return setMealSummary({
        total_calorie:0,
        total_protein:0,
        total_carbs:0,
        total_fat:0,
      })}

      if (data) {
        setMealSummary(data)
      } else {
        setMealSummary({
          total_calorie:0,
          total_protein:0,
          total_carbs:0,
          total_fat:0,
        })
      }

    } catch (error: any){
      console.error(error)
    }
  }
  const getCountGoal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/menu/goal/count`);
      const data = response.data

      console.log(' data',data);

      setGoalCount(data)

    } catch (error: any){
      console.error(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getSummaryMeal();
      getCountGoal();
    }, [])
  )

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getSummaryMeal();
    getCountGoal();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
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
              <Text style={{color:colors.text}} className='text-heading2 font-notoMedium'>{user?.displayName}</Text>
              <Text style={{color:colors.subText}} className=' font-noto'>{user?.email}</Text>
            </View>
            <View className='overflow-hidden rounded-full border border-gray'>
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
            className="flex flex-row gap-2 items-center justify-center rounded-normal border p-2 px-4 bg-red-500"
            style={{borderColor:colors.gray}}
          >
            <UserIcon width={30} height={30} color={colors.darkGray}/>
            <Text style={{color:colors.subText}} className="text-heading2 grow font-noto">account setting</Text>
            <ForwardIcon width={30} height={30} color={colors.darkGray}/>
          </TouchableOpacity>

          <View className='mt-2 items-center'>
            <View className='mb-1 w-full items-start'>
              <View className='flex flex-row gap-2 items-center'>
                <View className='grow'>
                  <Text style={{color:colors.text}} className='text-heading3 font-noto'>Personal info</Text>
                </View>
              </View>
            </View>
            <View className='w-[96%] justify-center items-center flex-row gap-1'>
              <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className=' rounded-normal border py-1 px-4 h-[4.5rem] justify-center'>
                <View style={{ transform: [{ translateY: 2 }]}}>
                  <Text style={{color:colors.subText}} className=' font-noto'>weight</Text>
                </View>
                <View className='flex-row gap-1 items-end'>
                  <Text style={{color:colors.green}} className='text-heading font-notoMedium'>{user?.weight}</Text>
                  <View style={{ transform: [{ translateY: -6 }] }}>
                    <Text style={{color:colors.subText}} className='font-noto text-detail'>kg</Text>
                  </View>
                </View>
              </View>
              <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className=' rounded-normal border py-1 px-4 h-[4.5rem] justify-center'>
                <View style={{ transform: [{ translateY: 2 }] }}>
                  <Text style={{color:colors.subText}} className=' font-noto'>height</Text>
                </View>
                <View className='flex-row gap-1 items-end'>
                  <Text style={{color:colors.green}} className=' text-heading font-notoMedium'>{user?.height}</Text>
                  <View style={{ transform: [{ translateY: -6 }] }}>
                    <Text style={{color:colors.subText}} className=' font-noto text-detail'>cm</Text>
                  </View>
                </View>
              </View>
              <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className=' rounded-normal border py-1 px-4 h-[4.5rem] min-w-[9rem] justify-center'>
                <Text style={{color:colors.subText}} className=' font-noto'>activity</Text>
                <View className='items-center'>
                  <Text style={{color:colors.primary}} className=' text-heading2 font-notoMedium'>
                    {
                      user?.activity
                        ? activity.find(a => a.id === user?.activity)?.title.split(' ')[0]
                        : 'no activity'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{height:1, width:'100%', backgroundColor:colors.gray}} className='my-3'/>

          <View className=' items-center'>
            <View className='mb-1 w-full items-start'>
              <View className='flex flex-row gap-2 items-center'>
                <View className='grow'>
                  <Text style={{color:colors.text}} className='text-heading3 font-noto'>Goals</Text>
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
                <TouchableOpacity onPress={()=>{router.push('/home/goal/complete')}} style={{backgroundColor:colors.white, borderColor:colors.gray}} className='flex-col p-1 px-2 h-[4.5rem] rounded-normal border items-center justify-center'>
                  <View style={{ transform: [{ translateY: 2 }] }}>
                    <Text style={{color:colors.subText}} className='font-noto text-body '>complete</Text>
                  </View>
                  <Text style={{color:colors.green}} className='text-heading font-notoMedium'>{goalCount.completed}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{router.push('/home/goal/inprogress')}} style={{backgroundColor:colors.white, borderColor:colors.gray}} className='flex-col p-1 px-2 h-[4.5rem] rounded-normal border items-center justify-center'>
                  <View style={{ transform: [{ translateY: 2 }] }}>
                    <Text style={{color:colors.subText}} className='font-noto text-body '>in complete</Text>
                  </View>
                  <Text style={{color:colors.yellow}} className='text-heading font-notoMedium'>{goalCount.in_progress}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{router.push('/home/goal/fail')}} style={{backgroundColor:colors.white, borderColor:colors.gray}} className='flex-col p-1 px-4 h-[4.5rem] rounded-normal border items-center justify-center'>
                  <View style={{ transform: [{ translateY: 2 }] }}>
                    <Text style={{color:colors.subText}} className='font-noto text-body style={{color:colors.subText}}'>failed</Text>
                  </View>
                  <Text style={{color:colors.red}} className='text-heading font-notoMedium'>{goalCount.failed}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{router.push('/home/createGoal')}} style={{backgroundColor:colors.white, borderColor:colors.gray}} className='flex-col p-1 px-2 h-[4.5rem] rounded-normal border items-center justify-center'>
                  <AddIcon width={30} height={30} color={colors.primary}/>
                  <Text style={{color:colors.subText}} className='text-body font-noto'>new goal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{height:1, width:'100%', backgroundColor:colors.gray}} className='my-3'/>

          <View className='mb-3'>
            <View className='flex flex-row gap-2 items-center'>
              <View className='grow'>
                <Text style={{color:colors.text}} className='text-heading3 font-noto'>your sleep</Text>
              </View>
            <View>
              <TouchableOpacity onPress={()=>{router.push('/menu/sleepSummary')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
                <Text className='text-body text-white font-notoMedium'>view all sleep</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
          <SleepSummary />
          <Text style={{color:colors.subText}} className=' my-2'>last night : {format(subDays(today, 1),'dd MMM yyyy')}</Text>
          <SleepToday />

          <View style={{height:1, width:'100%', backgroundColor:colors.gray}} className='my-3'/>

          <View className='mb-3'>
            <View className='flex flex-row gap-2 items-center'>
              <View className='grow'>
                <Text style={{color:colors.text}} className='text-heading3 font-noto'>your meal</Text>
              </View>
            <View>
            <TouchableOpacity onPress={()=>{router.push('/menu/foodSummary')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>view all meal</Text>
            </TouchableOpacity>
            </View>
          </View>
          </View>
          <FoodSummary/>
          <Text style={{color:colors.subText}} className='my-2'>today : {format(today,'dd MMM yyyy')}</Text>
          {mealSummary &&
              <FoodToday total_calorie={mealSummary?.total_calorie} total_protein={mealSummary?.total_protein} total_carbs={mealSummary?.total_carbs} total_fat={mealSummary?.total_fat}/>
          }
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