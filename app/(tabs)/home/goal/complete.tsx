import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import BackButton from '../../../../components/Back'
import { goalDataDummy } from '../../../../types/goal';
import HomeGoalCard from '../../../../components/goal/homeGoalCard';

const Complete = () => {

  const sortedGoalData = [
    ...goalDataDummy
      .filter((goal) => goal.total_task === goal.complete_task)
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
              <View className='flex flex-row gap-2 items-center'>

              </View>

              <View className='mt-2 flex-col gap-2'>
                {sortedGoalData.map((data,i)=>(
                  <HomeGoalCard key={i} goal_id={data.goal_id} goal_name={data.goal_name} end_date={data.end_date} total_task={data.total_task} complete_task={data.complete_task}/>
                ))}
              </View>
            </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Complete