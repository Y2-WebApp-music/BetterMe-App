import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { AddIcon, LeftArrowIcon } from '../../../constants/icon';
import { router } from 'expo-router';
import BackButton from '../../../components/Back';
import SearchInput from '../../../components/SearchInput';
import GoalCreateCard from '../../../components/goal/goalCreateCard';
import { goalCreateDataDummy } from '../../../types/goal';

const CreateGoal = () => {

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:4}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >

          <View className='mt-2 flex-col gap-2 justify-center items-start w-full'>
            {goalCreateDataDummy.map((data,i)=>(
              <GoalCreateCard key={i} goal_id={data.goal_id} goal_name={data.goal_name} start_date={data.start_date} end_date={data.end_date} total_task={data.total_task} create_by={data.create_by}/>
            ))}
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default CreateGoal