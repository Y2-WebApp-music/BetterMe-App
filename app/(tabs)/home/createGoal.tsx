import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { AddIcon, LeftArrowIcon } from '../../../constants/icon';
import { router } from 'expo-router';
import BackButton from '../../../components/Back';
import SearchInput from '../../../components/SearchInput';
import GoalCreateCard from '../../../components/goal/goalCreateCard';
import { goalCreateDataDummy } from '../../../types/goal';
import { FlashList } from '@shopify/flash-list';

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

      <View className="flex-1 w-[92%] mt-4">
        <FlashList
          data={goalCreateDataDummy}
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