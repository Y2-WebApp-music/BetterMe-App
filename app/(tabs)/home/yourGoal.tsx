import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, RefreshControl } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { router } from 'expo-router'
import { AddIcon, LeftArrowIcon } from '../../../constants/icon'
import { useAuth } from '../../../context/authContext'
import BackButton from '../../../components/Back'
import HomeGoalCard from '../../../components/goal/homeGoalCard'
import { goalDataDummy, homeGoalCardProp } from '../../../types/goal'
import SearchInput from '../../../components/SearchInput'
import axios from 'axios'
import { SERVER_URL } from '@env'
import { FlashList } from "@shopify/flash-list";

const YourGoal = () => {

  const { user } = useAuth()
  const [search, setSearch] = useState('')

  const [noGoal, setNoGoal] = useState(false)
  const [allGoal, setAllGoal] = useState<homeGoalCardProp[]>([])

  const [isNoTodayGoal, setIsNoTodayGoal] = useState(false)
  const [todayGoal, setTodayGoal] = useState<homeGoalCardProp[]>([])

  const getTodayGoal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/goal/today/${user?._id}`);
      const data = response.data // homeGoalCardProp[]

      // console.log('getTodayGoal response \n',response.data);

      if (data.message === "No goals for today") {
        setIsNoTodayGoal(true)
      } else {
        setTodayGoal(data)
      }

    } catch (error: any){
      console.error(error)
    }
  }

  const getAllGoal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/goal/user/${user?._id}`);
      const data = response.data // homeGoalCardProp[]

      console.log('getAllGoal response \n',response.data);

      if (data.message === "No goal") {
        setNoGoal(true)
      } else {
        setAllGoal([
          ...data.map((goal: any) => ({
            goal_id:goal.goal_id,
            goal_name:goal.goal_name,
            total_task:goal.total_task,
            complete_task:goal.complete_task,
            end_date:goal.end_date,
          })),
        ])
      }

    } catch (error: any){
      console.error(error)
    }
  }

  useMemo(()=>{
    console.log(' Refresh data');
    getTodayGoal()
    getAllGoal()
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
    setRefreshing(true);
    getAllGoal().finally(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <View className='w-[92%] mt-4'>
        <View className='w-full'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/home'}/>
          </View>
        </View>
        <View className='flex flex-row gap-2 items-center'>
          <View className='grow'>
            <Text className='text-subTitle text-primary font-notoMedium'>Your goal</Text>
          </View>
          <View>
            <TouchableOpacity onPress={()=>{router.push('/home/createGoal')}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>New Goal</Text>
              <AddIcon width={22} height={22} color={'white'}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
        {/*
        =============================
        ======== Goal Summary ========
        =============================
        */}
        <View className='flex w-full justify-center'>
          <View className='mt-3 w-full flex-row gap-2 items-center justify-center'>
            <TouchableOpacity onPress={()=>{router.push('/home/goal/complete')}} className='flex-col p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center'>
              <Text className='font-noto text-body text-subText'>complete</Text>
              <Text className='text-heading font-notoMedium text-green'>333</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{router.push('/home/goal/inprogress')}} className='flex-col p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center'>
              <Text className='font-noto text-body text-subText'>in progress</Text>
              <Text className='text-heading font-notoMedium text-yellow'>333</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{router.push('/home/goal/fail')}} className='flex-col p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center'>
              <Text className='font-noto text-body text-subText'>failed</Text>
              <Text className='text-heading font-notoMedium text-red'>333</Text>
            </TouchableOpacity>
          </View>
        </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <ScrollView
          className='w-[92%] h-auto pb-20'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className='mt-2'>


            {/*
            =============================
            ======== Today Goal ========
            =============================
            */}
            <View className='mt-3'>
              <View className='flex flex-row gap-2 items-center'>
                <Text className='text-heading3 font-noto grow'>Goals Today</Text>
                <Text className='text-body font-noto text-subText'>{sortedGoalData.length} goals todo</Text>
              </View>

              <View className='mt-2 flex-col gap-2'>
                {isNoTodayGoal? (
                  <View className='flex-1 justify-center items-center p-6 pt-20'>
                    <Text className='font-noto text-subText text-heading3'>No goal Today</Text>
                  </View>
                ):(
                  sortedGoalData.length != 0 &&
                    <FlashList
                      data={sortedGoalData}
                      renderItem={({ item }) =>
                        <HomeGoalCard goal_id={item.goal_id} goal_name={item.goal_name} end_date={item.end_date} total_task={item.total_task} complete_task={item.complete_task}/>
                      }
                      estimatedItemSize={200}
                    />
                )}
              </View>
            </View>
          </View>

          {/*
            =============================
            ======== Goal Summary ========
            =============================
            */}
          <View className='mt-3 pb-16 sticky'>
            <View className='flex flex-row gap-2 items-center'>
              <Text className='text-heading3 font-noto grow'>All Goals</Text>
            </View>
            <SearchInput
              name={'Search Goal...'}
              value={search}
              handleChange={(e:string)=>setSearch(e)}
            />
            <View className='mt-3 flex-col gap-2'>
              {noGoal? (
                  <View className='flex-1 justify-center items-center p-6 pt-20'>
                    <Text className='font-noto text-subText text-heading3'>No goal</Text>
                  </View>
                ):(
                  <View className='w-full min-h-32'>
                    <FlashList
                      data={allGoal}
                      renderItem={({ item }) =>
                        <HomeGoalCard goal_id={item.goal_id} goal_name={item.goal_name} end_date={item.end_date} total_task={item.total_task} complete_task={item.complete_task}/>
                      }
                      estimatedItemSize={200}
                    />
                  </View>
                )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export const allGoalDataDummy = [
  {
    goal_id:'1',
    goal_name:'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    end_date:new Date().toDateString(),
    total_task:12,
    complete_task:12,
  },
  {
    goal_id:'2',
    goal_name:'Title 2',
    end_date:new Date(new Date().setDate(new Date().getDate() + 45)).toDateString(),
    total_task:6,
    complete_task:2,
  },
  {
    goal_id:'3',
    goal_name:'Title 3',
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    total_task:6,
    complete_task:3,
  },
  {
    goal_id:'4',
    goal_name:'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    end_date:new Date().toDateString(),
    total_task:12,
    complete_task:12,
  },
  {
    goal_id:'5',
    goal_name:'Title 2',
    end_date:new Date(new Date().setDate(new Date().getDate() + 45)).toDateString(),
    total_task:6,
    complete_task:2,
  },
  {
    goal_id:'6',
    goal_name:'Title 3',
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    total_task:6,
    complete_task:3,
  },
  {
    goal_id:'7',
    goal_name:'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    end_date:new Date().toDateString(),
    total_task:12,
    complete_task:12,
  },
  {
    goal_id:'8',
    goal_name:'Title 2',
    end_date:new Date(new Date().setDate(new Date().getDate() + 45)).toDateString(),
    total_task:6,
    complete_task:2,
  },
  {
    goal_id:'9',
    goal_name:'Title 3',
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    total_task:6,
    complete_task:3,
  },
]

export default YourGoal