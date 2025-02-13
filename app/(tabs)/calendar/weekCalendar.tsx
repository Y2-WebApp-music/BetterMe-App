import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { AddIcon, ArrowIcon, BackwardIcon, ForwardIcon, GridIcon, MenuIcon } from '../../../constants/icon'
import { router, useFocusEffect } from 'expo-router'
import MealCard from '../../../components/food/mealCard'
import CalendarGoalCard from '../../../components/goal/calendarGoalCard'
import { subDays, addDays, startOfWeek, addWeeks, addDays as addDaysToDate } from 'date-fns';
import PagerView from 'react-native-pager-view';
import DateSlider from '../../../components/DateSlider'
import { FlashList } from '@shopify/flash-list'
import SleepToday from '../../../components/sleep/sleepToday'
import FoodToday from '../../../components/food/foodToday'
import { mealCard, mealListDummy, MealSummaryCard } from '../../../types/food'
import { toDateId } from '@marceloterreiro/flash-calendar'
import PickMonthYearModal from '../../../components/modal/PickMonthYearModal'
import axios from 'axios'
import { SERVER_URL } from '@env'
import { homeGoalCardProp } from '../../../types/goal'
import CalendarFoodToday from '../../../components/food/calendarFoodToday'

const WeekCalendar = () => {
  const [viewMeal, setViewMeal] = useState(true)
  const [openOption, setOpenOption] = useState(false)
  const [monthModal, setMonthModal] = useState(false)

  const [mealList, setMealList] = useState<mealCard[]>()
  const [goalList, setGoalList] = useState<homeGoalCardProp[]>()
  const [mealSummary, setMealSummary] = useState<MealSummaryCard>()

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<string>('');

  const goToToday = () => {
    setSelectedDate(today);
  };

  const getDateMeal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/calendar/meal/${toDateId(selectedDate)}`);
      const data = response.data 

      if (data) {
        setMealList(data)
      }

    } catch (error: any){
      console.error(error)
    }
  }

  const getDateGoal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/calendar/goal/${toDateId(selectedDate)}`);
      const data = response.data

      if (data) {
        setGoalList(data)
      }

    } catch (error: any){
      console.error(error)
    }
  }

  const getSummaryMeal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/calendar/meal/summary/${toDateId(selectedDate)}`);
      const data = response.data

      if ( data.message === "No meals found") {
        setMealSummary({
          total_calorie:0,
          total_protein:0,
          total_carbs:0,
          total_fat:0,
        })
        console.log(' No meals found ');
      }

      if (data) {
        setMealSummary(data)
        console.log('data ',data);
        
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

  useFocusEffect(
    useCallback(() => {
      getDateMeal()
      getDateGoal()
      getSummaryMeal()
    }, [])
  );

  useEffect(()=>{
    console.log('selectedDate ',selectedDate);
    getDateMeal()
    getDateGoal()
    getSummaryMeal()
  },[selectedDate])

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <View className='w-[92%] relative h-auto mt-3 flex-row items-center'>
        <View className='flex-row gap-4 items-center justify-start pr-4'>
          <TouchableOpacity activeOpacity={0.6} onPress={()=>{setMonthModal(!monthModal)}} className="min-w-fit flex-col justify-center items-start">
            <Text className="text-heading2 font-notoMedium ">{currentMonth.split(' ')[0]}</Text>
            <Text className="text-body font-noto text-nonFocus">{currentMonth.split(' ')[1]}</Text>
          </TouchableOpacity>
        </View>
        <View className={`border ${selectedDate.setHours(0, 0, 0, 0).toString() === today.setHours(0, 0, 0, 0).toString()?'border-primary':'border-gray'} p-1 px-2 rounded-normal`}>
          <TouchableOpacity onPress={goToToday}>
            <Text className={`text-detail font-noto ${selectedDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)? 'text-primary' : 'text-subText'}`}>Today</Text>
          </TouchableOpacity>
        </View>
        <View className='grow'></View>
        <TouchableOpacity onPress={()=>setOpenOption(!openOption)} className=' p-1 px-2 rounded-normal flex-row gap-1 items-center'>
          <Text className='text-subText font-noto text-body'>Week</Text>
          <ArrowIcon width={16} height={16} color={'#626262'} style={{transform:[openOption?{rotate:'180deg'}:{rotate:'0deg'}]}}/>
        </TouchableOpacity>
        {openOption && (
          <View className='absolute z-20 right-2 top-12 min-h-24 min-w-32 bg-white rounded-normal border border-gray p-4 flex-col gap-2'>
            <TouchableOpacity onPress={()=>{router.replace('/calendar/')}} className='p-2 px-4 border border-gray rounded-normal flex-row gap-2 justify-center items-center'>
              <MenuIcon width={22} height={22} color={'#626262'}/>
              <Text className='grow font-noto text-heading3 text-subText'>month</Text>
            </TouchableOpacity>
            <TouchableOpacity className='p-2 px-4 border border-primary rounded-normal flex-row gap-2 justify-center items-center'>
              <GridIcon width={22} height={22} color={'#1C60DE'}/>
              <Text className='grow font-noto text-heading3 text-primary'>week</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* <View className='flex-1'> */}
        <View style={{justifyContent: 'space-between', paddingHorizontal:16}} className='w-full flex-row mt-2'>
          <Text className='text-nonFocus font-noto text-detail text-center w-[40px]'>Sun</Text>
          <Text className='text-nonFocus font-noto text-detail text-center w-[40px]'>Mon</Text>
          <Text className='text-nonFocus font-noto text-detail text-center w-[40px]'>Tue</Text>
          <Text className='text-nonFocus font-noto text-detail text-center w-[40px]'>Wed</Text>
          <Text className='text-nonFocus font-noto text-detail text-center w-[40px] '>Thu</Text>
          <Text className='text-nonFocus font-noto text-detail text-center w-[40px]'>Fri</Text>
          <Text className='text-nonFocus font-noto text-detail text-center w-[40px]'>Sat</Text>
        </View>
        <DateSlider selectedDate={selectedDate} setSelectedDate={setSelectedDate} setCurrentMonthYear={setCurrentMonth}/>
        <PickMonthYearModal isOpen={monthModal} setIsOpen={setMonthModal} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setCurrentMonthYear={setCurrentMonth} currentMonth={currentMonth}/>
      {/* </View> */}

      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-col gap-2'>
            {/* <Text className='font-noto text-heading3'>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedDate))}</Text> */}
            <SleepToday/>
            {mealSummary &&
              <CalendarFoodToday total_calorie={mealSummary?.total_calorie} total_protein={mealSummary?.total_protein} total_carbs={mealSummary?.total_carbs} total_fat={mealSummary?.total_fat}/>
            }
            <Text className='text-subText font-noto text-body mt-2'>In this day</Text>
            <View className='flex-row justify-start items-center gap-4'>
              <TouchableOpacity onPress={()=>setViewMeal(true)} className={`p-1 px-2 ${viewMeal? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text className={`${viewMeal? 'text-white':'text-subText'} text-heading2 font-notoMedium`}>Meals</Text>
              </TouchableOpacity>
              <View className='h-full w-[1px] bg-subText rounded-full'/>
              <TouchableOpacity onPress={()=>setViewMeal(false)} className={`p-1 px-2 ${!viewMeal? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text className={`${!viewMeal? 'text-white':'text-subText'} text-heading2 font-notoMedium`}>Goals</Text>
              </TouchableOpacity>
              <View className='grow'/>
              {viewMeal?(
                <TouchableOpacity onPress={()=>{router.push('/calendar/addMeal')}} className='rounded-full p-1 px-4 bg-primary flex-row items-center justify-center gap-1'>
                  <Text className='text-white font-noto text-heading3'>add meal</Text>
                  <AddIcon width={22} height={22} color={'#fff'}/>
                </TouchableOpacity>
              ):(
                <></>
              )
              }
            </View>
            {viewMeal? (
              <View className='w-full justify-center items-center gap-2 mt-2 pb-16'>
                <View className='w-full'>
                  {mealList &&
                    <FlashList
                      data={mealList}
                      renderItem={({ item }) =>
                        <MealCard meal_id={item.meal_id} meal_date={item.meal_date} food_name={item.food_name} calorie={item.calorie} createByAI={item.createByAI}/>
                      }
                      estimatedItemSize={200}
                    />
                  }
                </View>
              </View>
            ):(
              <View className='w-full justify-center items-center gap-2 mt-2 pb-16'>
                <View className='w-full'>
                  {goalList &&
                    <FlashList
                      data={goalList}
                      renderItem={({ item }) =>
                        <CalendarGoalCard goal_id={item.goal_id} goal_name={item.goal_name} total_task={item.total_task} complete_task={item.complete_task}/>
                      }
                      estimatedItemSize={200}
                    />
                  }
                </View>
              </View>

            )}
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const goalDataDummy = [
  {
    goal_id:'1',
    goal_name:'Title Test 1',
    total_task:8,
    complete_task:3,
  },
  {
    goal_id:'2',
    goal_name:'Title Test 2',
    total_task:8,
    complete_task:3,
  },
  {
    goal_id:'3',
    goal_name:'Title Test 3',
    total_task:8,
    complete_task:3,
  },
]

export default WeekCalendar