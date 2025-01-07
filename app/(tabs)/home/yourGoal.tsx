import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { router } from 'expo-router'
import { AddIcon, LeftArrowIcon } from '../../../constants/icon'
import { useAuth } from '../../../context/authContext'
import BackButton from '../../../components/Back'
import HomeGoalCard from '../../../components/goal/homeGoalCard'
import { goalDataDummy } from '../../../types/goal'
import SearchInput from '../../../components/SearchInput'

const YourGoal = () => {

  const { user } = useAuth()
  const [search, setSearch] = useState('')

  const sortedGoalData = [
    ...goalDataDummy
      .filter((goal) => goal.total_task !== goal.complete_task)
      .sort((a, b) => {
        const dateA = new Date(a.end_date).setHours(0, 0, 0, 0);
        const dateB = new Date(b.end_date).setHours(0, 0, 0, 0);
        return dateA - dateB;
      })
  ];

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
            ======== Goal Summary ========
            =============================
            */}
            <View className=''>
              <View className='mt-3 w-full flex-row gap-2 items-center justify-center'>
                <View className='flex-col p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center'>
                  <Text className='font-noto text-body text-subText'>complete</Text>
                  <Text className='text-heading font-notoMedium text-green'>333</Text>
                </View>
                <View className='flex-col p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center'>
                  <Text className='font-noto text-body text-subText'>in progress</Text>
                  <Text className='text-heading font-notoMedium text-yellow'>333</Text>
                </View>
                <View className='flex-col p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center'>
                  <Text className='font-noto text-body text-subText'>failed</Text>
                  <Text className='text-heading font-notoMedium text-red'>333</Text>
                </View>
              </View>
            </View>

            {/*
            =============================
            ======== Today Goal ========
            =============================
            */}
            <View className='mt-3'>
              <View className='flex flex-row gap-2 items-center'>
                <Text className='text-heading3 font-noto grow'>Goals Today</Text>
                <Text className='text-body font-noto text-subText'>3 goals todo</Text>
              </View>

              <View className='mt-2 flex-col gap-2'>
                {sortedGoalData.map((data,i)=>(
                  <HomeGoalCard key={i} goal_id={data.goal_id} goal_name={data.goal_name} end_date={data.end_date} total_task={data.total_task} complete_task={data.complete_task}/>
                ))}
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
              {allGoalDataDummy.map((data,i)=>(
                <HomeGoalCard key={i} goal_id={data.goal_id} goal_name={data.goal_name} end_date={data.end_date} total_task={data.total_task} complete_task={data.complete_task}/>
              ))}
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
    end_date:new Date(),
    total_task:12,
    complete_task:12,
  },
  {
    goal_id:'2',
    goal_name:'Title 2',
    end_date:new Date(new Date().setDate(new Date().getDate() + 45)),
    total_task:6,
    complete_task:2,
  },
  {
    goal_id:'3',
    goal_name:'Title 3',
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)),
    total_task:6,
    complete_task:3,
  },
  {
    goal_id:'4',
    goal_name:'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    end_date:new Date(),
    total_task:12,
    complete_task:12,
  },
  {
    goal_id:'5',
    goal_name:'Title 2',
    end_date:new Date(new Date().setDate(new Date().getDate() + 45)),
    total_task:6,
    complete_task:2,
  },
  {
    goal_id:'6',
    goal_name:'Title 3',
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)),
    total_task:6,
    complete_task:3,
  },
  {
    goal_id:'7',
    goal_name:'Title 1 Line test text inline style Second Line First Line test text inline style Second Line First Line test text inline style Second Line',
    end_date:new Date(),
    total_task:12,
    complete_task:12,
  },
  {
    goal_id:'8',
    goal_name:'Title 2',
    end_date:new Date(new Date().setDate(new Date().getDate() + 45)),
    total_task:6,
    complete_task:2,
  },
  {
    goal_id:'9',
    goal_name:'Title 3',
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)),
    total_task:6,
    complete_task:3,
  },
]

export default YourGoal