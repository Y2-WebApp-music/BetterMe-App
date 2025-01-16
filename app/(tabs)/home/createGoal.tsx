import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { AddIcon, LeftArrowIcon } from '../../../constants/icon';
import { router } from 'expo-router';
import BackButton from '../../../components/Back';
import SearchInput from '../../../components/SearchInput';
import GoalCreateCard from '../../../components/goal/goalCreateCard';
import { GoalCreateCardProp, goalCreateDataDummy } from '../../../types/goal';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../../context/authContext';
import { SERVER_URL } from '@env';
import axios from 'axios';

const CreateGoal = () => {

  const { user } = useAuth()

  const [refreshing, setRefreshing] = useState(false);
  const [goal,setGoal] = useState<GoalCreateCardProp[]>([])
  const [isNoGoal,setIsNoGoal] = useState(false)

  const getSearchGoal = async () => {
    try {
      console.log('user?._id :',user?._id);
      const response = await axios.get(`${SERVER_URL}/goal/all`);
      const data = response.data // homeGoalCardProp[]

      console.log('response \n',response.data);

      if (data.message === "Goal not found") {
        setIsNoGoal(true)
      } else {
        setGoal([
          ...data.map((goal: any) => ({
            goal_id: goal.goal_id,
            goal_name: goal.goal_name,
            total_task: goal.total_task,
            start_date: goal.start_date,
            end_date: goal.end_date,
            create_by: goal.create_by.username,
          })),
        ])
      }

    } catch (error: any){
      console.error(error)
    }
  }

  useMemo(()=>{
    getSearchGoal()
  },[])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getSearchGoal()
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const [search, setSearch] = useState('')
  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <View className='w-[92%] mt-4'>
        <View className='w-full'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/home'}/>
          </View>
        </View>
        <View className='mt-2'>
          <View className='flex flex-row gap-2 items-center'>
            <View className='grow'>
              <Text className='text-subTitle text-primary font-notoMedium'>Create Goal</Text>
            </View>
            <View>
              <TouchableOpacity onPress={()=>{router.push(`/home/goal/create/blank`)}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
                <Text className='text-body text-white font-notoMedium'>Create your own</Text>
                <AddIcon width={22} height={22} color={'white'}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <SearchInput name={'search goal ...'} value={search} handleChange={(e)=>{setSearch(e)}}/>
      </View>

      <View className="flex-1 w-[92%] mt-4">
        <FlashList
          data={goal}
          renderItem={({ item }) => (
            <GoalCreateCard
              goal_id={item.goal_id}
              goal_name={item.goal_name}
              start_date={item.start_date}
              end_date={item.end_date}
              total_task={item.total_task}
              create_by={item.create_by}
            />
          )}
          estimatedItemSize={200}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  )
}

export default CreateGoal