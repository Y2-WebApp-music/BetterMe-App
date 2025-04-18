import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { AddIcon, LeftArrowIcon } from '../../../constants/icon'
import { useAuth } from '../../../context/authContext'
import BackButton from '../../../components/Back'
import HomeGoalCard from '../../../components/goal/homeGoalCard'
import { goalDataDummy, homeGoalCardProp } from '../../../types/goal'
import SearchInput from '../../../components/SearchInput'
import axios from 'axios'
import { SERVER_URL } from '@env'
import { FlashList } from "@shopify/flash-list";
import { useTheme } from '../../../context/themeContext'

const YourGoal = () => {

  const { colors } = useTheme();
  const { user } = useAuth()

  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [serverResponse, setServerResponse] = useState(false)

  useEffect(()=>{
    console.log('serverResponse',serverResponse);
    console.log('isSearching',isSearching);
  },[isSearching, serverResponse])

  const [noGoal, setNoGoal] = useState(false)
  const [allGoal, setAllGoal] = useState<homeGoalCardProp[]>([])
  const [searchGoal, setSearchGoal] = useState<homeGoalCardProp[]>([])

  const [isNoTodayGoal, setIsNoTodayGoal] = useState(false)
  const [todayGoal, setTodayGoal] = useState<homeGoalCardProp[]>([])

  const [summary,setSummary] = useState({
    complete:0,
    inprogress:0,
    fail:0,
  })

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

      // console.log('getAllGoal response \n',response.data);

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

  const updateSummary = (allGoal: homeGoalCardProp[]) => {
    // console.log('updateSummary');
    // console.log('All Goal Data:', allGoal);
    const todayDate = new Date().setHours(0, 0, 0, 0);
    let complete = 0;
    let inprogress = 0;
    let fail = 0;
  
    allGoal.forEach(goal => {
      const goalEndDate = new Date(goal.end_date).setHours(0, 0, 0, 0);

      if (goal.complete_task === goal.total_task) {
        complete += 1;
      }
      else if (goal.complete_task < goal.total_task && goalEndDate >= todayDate) {
        inprogress += 1;
      }
      else if (goal.complete_task < goal.total_task && goalEndDate < todayDate) {
        fail += 1;
      }
    });
  
    // console.log('Complete:', complete, 'In Progress:', inprogress, 'Fail:', fail);
    setSummary({ complete, inprogress, fail });
  };

  useEffect(() => {
    if (allGoal.length > 0) {
      updateSummary(allGoal);
    }
  }, [allGoal]);

  const sortedGoalData = todayGoal?
  [
    ...todayGoal
      .filter((goal) => goal.total_task !== goal.complete_task)
      .sort((a, b) => {
        const dateA = new Date(a.end_date).setHours(0, 0, 0, 0);
        const dateB = new Date(b.end_date).setHours(0, 0, 0, 0);
        return dateA - dateB;
      }),
      // ...todayGoal
      // .filter((goal) => goal.total_task === goal.complete_task)
      // .sort((a, b) => {
      //   const dateA = new Date(a.end_date).setHours(0, 0, 0, 0);
      //   const dateB = new Date(b.end_date).setHours(0, 0, 0, 0);
      //   return dateA - dateB;
      // }),
  ] : [];

  const handleSearch = () => {
    console.log('search input', search);

    setSearchGoal(allGoal.filter((item) =>
      item.goal_name.toLowerCase().includes(search.toLowerCase())
    ))
    setServerResponse(true)
  }

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTodayGoal().finally(() => setRefreshing(false));
    setRefreshing(true);
    getAllGoal().finally(() => setRefreshing(false));
    updateSummary(allGoal)
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTodayGoal()
      getAllGoal()
      updateSummary(allGoal)
    }, [])
  );

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
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
            <TouchableOpacity style={{backgroundColor:colors.white, borderColor:colors.gray}} onPress={()=>{router.push('/home/goal/complete')}} className='flex-col p-1 px-4 min-w-28 rounded-normal border items-center justify-center'>
              <Text style={{color:colors.subText}} className='font-noto text-body'>complete</Text>
              <Text className='text-heading font-notoMedium text-green'>{summary.complete}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:colors.white, borderColor:colors.gray}} onPress={()=>{router.push('/home/goal/inprogress')}} className='flex-col p-1 px-4 min-w-28 rounded-normal border items-center justify-center'>
              <Text style={{color:colors.subText}} className='font-noto text-body '>in progress</Text>
              <Text className='text-heading font-notoMedium text-yellow'>{summary.inprogress}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:colors.white, borderColor:colors.gray}} onPress={()=>{router.push('/home/goal/fail')}} className='flex-col p-1 px-4 min-w-28 rounded-normal border items-center justify-center'>
              <Text style={{color:colors.subText}} className='font-noto text-body '>failed</Text>
              <Text className='text-heading font-notoMedium text-red'>{summary.fail}</Text>
            </TouchableOpacity>
          </View>
        </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <ScrollView
          className='w-full h-auto pb-20'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignContent:'center', marginTop:0}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className='mt-2 items-center justify-center'>


            {/*
            =============================
            ======== Today Goal ========
            =============================
            */}
            <View className='mt-3 w-[92%]'>
              <View className='flex flex-row gap-2 items-center'>
                <Text style={{color:colors.text}} className='text-heading3 font-noto grow'>Goals Today</Text>
                <Text className='text-body font-noto text-subText'>{sortedGoalData.length} goals todo</Text>
              </View>

              <View className='mt-2 flex-col gap-2'>
                {isNoTodayGoal? (
                  <View style={{width:'100%', height:80, justifyContent:'center', alignContent:'center'}}>
                    <Text style={{color:colors.subText}} className='font-noto text-heading3 text-center'>No goal Today</Text>
                  </View>
                ):(
                  sortedGoalData.length != 0 ? (
                    <FlashList
                      data={sortedGoalData}
                      renderItem={({ item }) =>
                        <HomeGoalCard goal_id={item.goal_id} goal_name={item.goal_name} end_date={item.end_date} total_task={item.total_task} complete_task={item.complete_task}/>
                      }
                      estimatedItemSize={200}
                    />
                  ):(
                    <View style={{width:'100%', height:80, justifyContent:'center', alignContent:'center'}}>
                      <Text className='font-noto text-subText text-heading3 text-center'>No goal Todo</Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>

          {/*
            =============================
            ======== Goal Summary ========
            =============================
            */}
          <View className='mt-3 pb-16 sticky items-center justify-center'>
            <View className='flex flex-row gap-2 items-center w-[92%]'>
              <Text style={{color:colors.text}} className='text-heading3 font-noto grow'>All Goals</Text>
            </View>
            <View className='w-full'>
              <SearchInput search={search} setSearch={setSearch} submit={handleSearch} setFocus={setIsSearching} setClear={setServerResponse}/>
            </View>
            <View className='mt-3 flex-col gap-2 w-[92%]'>
              {noGoal? (
                  <View className='flex-1 justify-center items-center p-6 pt-20'>
                    <Text className='font-noto text-subText text-heading3'>No goal</Text>
                  </View>
                ):(
                  !isSearching && serverResponse? (
                    <View className='w-full min-h-32'>
                      <FlashList
                        data={searchGoal}
                        renderItem={({ item }) =>
                          <HomeGoalCard goal_id={item.goal_id} goal_name={item.goal_name} end_date={item.end_date} total_task={item.total_task} complete_task={item.complete_task}/>
                        }
                        estimatedItemSize={200}
                      />
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
                  )
                )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


export default YourGoal