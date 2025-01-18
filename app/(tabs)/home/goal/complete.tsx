import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import BackButton from '../../../../components/Back'
import { goalDataDummy, homeGoalCardProp } from '../../../../types/goal';
import HomeGoalCard from '../../../../components/goal/homeGoalCard';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { useAuth } from '../../../../context/authContext';
import { useFocusEffect } from 'expo-router';

const Complete = () => {

  const { user } = useAuth()
  const [goal, setGoal] = useState<homeGoalCardProp[]>([])
  const [isEmpty, setIsEmpty] = useState<boolean>(false)

  const getGoal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/goal/complete/${user?._id}`);
      const data = response.data // homeGoalCardProp[]

      // console.log('getGoal response \n',response.data);

      if ((data.message === "Goal not found") || (data.message === "No completed goals")) {
        setIsEmpty(true)
      } else {
        setGoal([
          ...data.map((goal: any) => ({
            goal_id:goal._id,
            goal_name:goal.goal_name,
            total_task:goal.tasks.length,
            complete_task:goal.tasks.filter((task:any) => task.status === true).length,
            end_date:goal.end_date,
          })),
        ])
      }

    } catch (error: any){
      console.error(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getGoal()
    }, [])
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getGoal()
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  return (
    <SafeAreaView className="w-full h-full justify-start items-center bg-Background font-noto" >
      <View className='w-[92%] mt-4'>
        <View className='w-full'>
          <View className='max-w-[14vw]'>
            <BackButton />
          </View>
        </View>
        <View className='flex flex-row gap-2 items-center mt-2'>
          <View className='grow'>
            <Text className='text-subTitle text-green font-notoMedium'>Complete goal</Text>
          </View>
        </View>
      </View>
      <ScrollView
        className='w-[92%] h-auto pb-20 mt-2'
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className=''>
          {isEmpty? (
            <View className='flex flex-row gap-2 h-[60vh] items-center justify-center'>
              <Text className='font-noto text-subText text-heading2'>No goal</Text>
            </View>
          ):(
            <View className='mt-2 flex-col gap-2'>
              <FlashList
                data={goal}
                renderItem={({ item }) =>
                <HomeGoalCard goal_id={item.goal_id} goal_name={item.goal_name} end_date={item.end_date} total_task={item.total_task} complete_task={item.complete_task}/>
                }
                estimatedItemSize={200}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Complete