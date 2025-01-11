import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HomeGoalCard from '../../../components/goal/homeGoalCard';
import { AddIcon } from '../../../constants/icon';
import { useAuth } from '../../../context/authContext';
import { goalDataDummy, homeGoalCardProp } from '../../../types/goal';
import SleepGoal from '../../../components/sleep/sleepGoal';
import FoodGoal from '../../../components/food/foodGoal';
import { SERVER_URL } from '@env';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const Home = () => {

  const { user } = useAuth();

  const [todayGoal, setTodayGoal] = useState<homeGoalCardProp[]>([])

  const getTodayGoal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/goal/today/677f63f501337ea283f7c8fc`);
      const data = response.data // homeGoalCardProp[]
      console.log('data \n',data);
      console.log('typeof Date \n',typeof data[0].end_date);

      setTodayGoal(data)
    } catch (error: any){
      console.error(error)
    }
  }

  useMemo(()=>{
    getTodayGoal()
  },[])


  const sortedGoalData = todayGoal?
  [
    ...todayGoal
      .filter((goal) => goal.total_task !== goal.complete_task)
      .sort((a, b) => {
        const dateA = new Date(a.end_date).setHours(0, 0, 0, 0);
        const dateB = new Date(b.end_date).setHours(0, 0, 0, 0);
        return dateA - dateB;
      }),
    ...todayGoal
      .filter((goal) => goal.total_task === goal.complete_task)
      .sort((a, b) => {
        const dateA = new Date(a.end_date).setHours(0, 0, 0, 0);
        const dateB = new Date(b.end_date).setHours(0, 0, 0, 0);
        return dateA - dateB;
      }),
  ] : [];

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTodayGoal().finally(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:14}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
                source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
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
            <FoodGoal />
            <SleepGoal />
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
                <Text className='text-body font-noto text-subText'>3 goals todo</Text>
              </View>
              <View>
                <TouchableOpacity onPress={()=>{router.push('/home/createGoal')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
                  <Text className='text-heading2 text-white font-notoMedium'>New Goal</Text>
                  <AddIcon width={26} height={26} color={'white'}/>
                </TouchableOpacity>
              </View>
            </View>

            <View className='mt-2 flex-col gap-2'>
              {sortedGoalData.length != 0 &&
                sortedGoalData.map((data,i)=>(
                  <HomeGoalCard key={i} goal_id={data.goal_id} goal_name={data.goal_name} end_date={data.end_date} total_task={data.total_task} complete_task={data.complete_task}/>
                ))
              }
              {/* {todayGoal.length != 0 &&
                todayGoal.map((data,i)=>(
                  <HomeGoalCard key={i} goal_id={data.goal_id} goal_name={data.goal_name} end_date={data.end_date} total_task={data.total_task} complete_task={data.complete_task}/>
                ))
              } */}
              <View className='flex-1 justify-center items-center'>
                <TouchableOpacity onPress={()=>{router.push('/home/yourGoal')}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
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

export default Home