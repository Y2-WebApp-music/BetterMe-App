import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Switch, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from "react";
import { Calendar, toDateId, CalendarTheme } from "@marceloterreiro/flash-calendar";
import { AddIcon, ArrowIcon, BackwardIcon, ForwardIcon, GridIcon, MenuIcon } from '../../../constants/icon';
import { router, useFocusEffect } from 'expo-router';
import CalendarGoalCard from '../../../components/goal/calendarGoalCard';
import MealCard from '../../../components/food/mealCard';
import { FlashList } from '@shopify/flash-list';
import FoodToday from '../../../components/food/foodToday';
import SleepToday from '../../../components/sleep/sleepToday';
import { mealCard, mealListDummy, MealSummaryCard } from '../../../types/food';
import PickMonthYearModal from '../../../components/modal/PickMonthYearModal';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { homeGoalCardProp } from '../../../types/goal';
import CalendarFoodToday from '../../../components/food/calendarFoodToday';
import { useTheme } from '../../../context/themeContext';

const MonthCalendar = () => {

  const { colors } = useTheme();
  const today = toDateId(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthModal, setMonthModal] = useState(false);

  const [viewMeal, setViewMeal] = useState(true)
  const [openOption, setOpenOption] = useState(false)

  const [mealList, setMealList] = useState<mealCard[]>()
  const [goalList, setGoalList] = useState<homeGoalCardProp[]>()
  const [mealSummary, setMealSummary] = useState<MealSummaryCard>()

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(toDateId(new Date()));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const modalMonthPick = (e: Date) => {
    console.log('Date : ',e);
    
    setSelectedDate(toDateId(e));
    setCurrentMonth(new Date(e.getFullYear(), e.getMonth()));

  };

  const [monthName, setMonthName] = useState(currentMonth.toLocaleString("en-US", { month: "long" }));
  const [year, setYear] = useState(currentMonth.getFullYear());

  useEffect(()=>{
    setMonthName(currentMonth.toLocaleString("en-US", { month: "long" }));
    setYear(currentMonth.getFullYear());

    console.log('currentMonth ',currentMonth);
    
  },[currentMonth])

  const modalYearMonth = (e:string) => {
    const [month, year] = e.split(' ');

    console.log('month ',month,'year ',parseInt(year));
    
    
    setMonthName(month)
    setYear(parseInt(year));

  }

  const getDateMeal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/calendar/meal/${selectedDate}`);
      const data = response.data 

      console.log('response getDateMeal\n',);
      if (data) {
        setMealList(data)
      }

    } catch (error: any){
      console.error('getDateMeal',error)
    }
  }

  const getDateGoal = async () => {
    try {
      const date = (() => {
        const d = new Date(selectedDate);
        d.setHours(7);
        return d.toISOString();
      })();
      
      const response = await axios.get(`${SERVER_URL}/calendar/goal/${date}`);
      const data = response.data

      console.log('response getDateGoal\n');

      if (data) {
        setGoalList(data)
      }

    } catch (error: any){
      console.error('getDateGoal',error)
    }
  }

  const getSummaryMeal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/calendar/meal/summary/${selectedDate}`);
      const data = response.data

      console.log('response getSummaryMeal \n');
      if ( data.message === "No meals found") {return setMealSummary({
        total_calorie:0,
        total_protein:0,
        total_carbs:0,
        total_fat:0,
      })}

      if (data) {
        setMealSummary(data)
      } else {
        setMealSummary({
          total_calorie:0,
          total_protein:0,
          total_carbs:0,
          total_fat:0,
        })
      }

    } catch (error: any){
      console.error('getSummaryMeal',error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log('selectedDate ',selectedDate);
      getDateMeal()
      getDateGoal()
      getSummaryMeal()
    }, [selectedDate])
  );

  // useEffect(()=>{
  //   console.log('selectedDate ',selectedDate);
  //   getDateMeal()
  //   getDateGoal()
  //   getSummaryMeal()
  // },[selectedDate])

  const linearAccent = colors.primary; // Use the primary color from theme for accent color

  const linearTheme: CalendarTheme = {
    rowMonth: {
      content: {
        textAlign: "left",
        color: colors.text, // Use the text color from theme
        fontWeight: "700",
        display: 'none',
      },
    },
    itemWeekName: { content: { color: colors.subText } },
    itemDayContainer: {
      activeDayFiller: {
        backgroundColor: linearAccent, // Use dynamic accent color
      },
    },
    itemDay: {
      idle: ({ isPressed, isWeekend }) => ({
        container: {
          backgroundColor: isPressed ? linearAccent : "transparent",
          borderRadius: 99,
        },
        content: {
          color: isWeekend && !isPressed ? colors.text : colors.text, // Use theme text color
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'noto-sans-thai',
        },
      }),
      today: ({ isPressed }) => ({
        container: {
          borderColor: "rgba(0, 0, 0, 0)",
          borderRadius: isPressed ? 99 : 99,
          backgroundColor: isPressed ? linearAccent : "#B8C2D2",
        },
        content: {
          color: isPressed ? colors.text : "rgba(255, 255, 255, 1)",
          fontSize: 16,
          fontWeight: 600,
          fontFamily: 'noto-sans-thai',
        },
      }),
      active: ({ isEndOfRange, isStartOfRange }) => ({
        container: {
          backgroundColor: linearAccent,
          borderTopLeftRadius: isStartOfRange ? 99 : 20,
          borderBottomLeftRadius: isStartOfRange ? 99 : 20,
          borderTopRightRadius: isEndOfRange ? 99 : 20,
          borderBottomRightRadius: isEndOfRange ? 99 : 20,
        },
        content: {
          color: "#ffffff",
        },
      }),
    },
  };

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
      <View className='w-[98%] relative px-2 h-auto mt-3 flex-row items-center'>
        <View style={{borderColor:selectedDate === today?colors.primary:colors.gray}} className={`absolute top-3 left-4 border p-1 px-2 rounded-normal`}>
          <TouchableOpacity onPress={goToToday}>
            <Text style={{color:selectedDate === today ?colors.primary:colors.subText}} className={`text-detail font-noto`}>Today</Text>
          </TouchableOpacity>
        </View>
        <View className='grow flex-row gap-4 items-center justify-center'>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <BackwardIcon color={'#1C60DE'}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{setMonthModal(!monthModal)}} className="w-[26vw] flex-col justify-center items-center">
            <Text style={{color:colors.text}} className="text-heading2 font-notoMedium">{monthName}</Text>
            <Text style={{color:colors.nonFocus}} className="text-body">{year}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextMonth}>
            <ForwardIcon color={'#1C60DE'}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>setOpenOption(!openOption)} className='absolute top-3 right-2 p-1 px-2 rounded-normal flex-row gap-1 items-center'>
          <Text style={{color:colors.subText}} className=' font-noto text-body'>Month</Text>
          <ArrowIcon width={16} height={16} color={colors.darkGray} style={{transform:[openOption?{rotate:'180deg'}:{rotate:'0deg'}]}}/>
        </TouchableOpacity>
        {openOption && (
          <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className='absolute z-20 right-2 top-12 min-h-24 min-w-32 rounded-normal border p-4 flex-col gap-2'>
            <TouchableOpacity className='p-2 px-4 border border-primary rounded-normal flex-row gap-2 justify-center items-center'>
              <MenuIcon width={22} height={22} color={'#1C60DE'}/>
              <Text className='grow font-noto text-heading3 text-primary'>month</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{router.replace('/calendar/weekCalendar')}} style={{borderColor:colors.gray}} className='p-2 px-4 border rounded-normal flex-row gap-2 justify-center items-center'>
              <GridIcon width={22} height={22} color={colors.darkGray}/>
              <Text style={{color:colors.subText}} className='grow font-noto text-heading3 '>week</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <PickMonthYearModal isOpen={monthModal} setIsOpen={setMonthModal} selectedDate={new Date(selectedDate)} setSelectedDate={(e) => modalMonthPick(e)} setCurrentMonthYear={(e) => modalYearMonth(e)} currentMonth={(`${monthName} ${year.toString()}`)}/>
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
          showsVerticalScrollIndicator={false}
        >

          <View style={{ transform: [{ translateY: -24 }] }} className="flex gap-2 items-center">
            <View className='max-h-[42vh]'>
              <Calendar
                calendarActiveDateRanges={[
                  {
                    startId: selectedDate,
                    endId: selectedDate,
                  },
                ]}
                calendarFirstDayOfWeek="sunday"
                calendarDayHeight={40}
                calendarRowVerticalSpacing={0}
                calendarRowHorizontalSpacing={10}
                onCalendarDayPress={setSelectedDate}
                calendarMonthId={toDateId(currentMonth)}
                theme={linearTheme}
              />
            </View>
            <View className='flex justify-center items-center'>
              <View style={{backgroundColor:colors.nonFocus}} className='h-1 w-[20vw] rounded-full'></View>
            </View>
          </View>
          <View style={{ transform: [{ translateY: -18 }] }} className='flex-col gap-2'>
            <Text style={{color:colors.text}} className='font-noto text-heading3'>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedDate))}</Text>
            <SleepToday select_date={selectedDate}/>
            {mealSummary &&
              <CalendarFoodToday total_calorie={mealSummary?.total_calorie} total_protein={mealSummary?.total_protein} total_carbs={mealSummary?.total_carbs} total_fat={mealSummary?.total_fat}/>
            }
            <Text style={{color:colors.subText}} className=' font-noto text-body mt-2'>In this day</Text>
            <View className='flex-row justify-start items-center gap-4'>
              <TouchableOpacity onPress={()=>setViewMeal(true)} className={`p-1 px-2 ${viewMeal? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text style={{color:viewMeal? '#fff':colors.subText}}  className={` text-heading2 font-notoMedium`}>Meals</Text>
              </TouchableOpacity>
              <View className='h-full w-[1px] bg-subText rounded-full'/>
              <TouchableOpacity onPress={()=>setViewMeal(false)} className={`p-1 px-2 ${!viewMeal? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text style={{color:!viewMeal? '#fff':colors.subText}} className={` text-heading2 font-notoMedium`}>Goals</Text>
              </TouchableOpacity>
              <View className='grow'/>
              {viewMeal?(
                <TouchableOpacity onPress={()=>{router.push(`/calendar/addMeal/${selectedDate}`)}} className='rounded-full p-1 px-4 bg-primary flex-row items-center justify-center gap-1'>
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

export default MonthCalendar