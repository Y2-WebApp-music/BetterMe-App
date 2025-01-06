import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Switch, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from "react";
import { Calendar, toDateId, CalendarTheme } from "@marceloterreiro/flash-calendar";
import { AddIcon, ArrowIcon, BackwardIcon, ForwardIcon, GridIcon, MenuIcon } from '../../../constants/icon';
import { router } from 'expo-router';
import CalendarGoalCard from '../../../components/goal/calendarGoalCard';
import MealCard from '../../../components/food/mealCard';

const MonthCalendar = () => {

  const today = toDateId(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [viewMeal, setViewMeal] = useState(true)

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

  const monthName = currentMonth.toLocaleString("en-US", { month: "long" });
  const year = currentMonth.getFullYear();

  const [openOption, setOpenOption] = useState(false)

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <View className='w-full relative px-2 h-auto mt-3 flex-row items-center'>
        <View className={`absolute top-3 left-4 border ${selectedDate === today?'border-primary':'border-gray'} p-1 px-2 rounded-normal`}>
          <TouchableOpacity onPress={goToToday}>
            <Text className={`text-detail font-noto ${selectedDate === today ? 'text-primary' : 'text-subText'}`}>Today</Text>
          </TouchableOpacity>
        </View>
        <View className='grow flex-row gap-4 items-center justify-center'>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <BackwardIcon color={'#1C60DE'}/>
          </TouchableOpacity>
          <View className="w-[26vw] flex-col justify-center items-center">
            <Text className="text-heading2 font-notoMedium">{monthName}</Text>
            <Text className="text-body text-nonFocus">{year}</Text>
          </View>
          <TouchableOpacity onPress={goToNextMonth}>
            <ForwardIcon color={'#1C60DE'}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>setOpenOption(!openOption)} className='absolute top-3 right-2 p-1 px-2 rounded-normal flex-row gap-1 items-center'>
          <Text className='text-subText font-noto text-body'>Month</Text>
          <ArrowIcon width={16} height={16} color={'#626262'} style={{transform:[openOption?{rotate:'180deg'}:{rotate:'0deg'}]}}/>
        </TouchableOpacity>
        {openOption && (
          <View className='absolute z-20 right-2 top-12 min-h-24 min-w-32 bg-white rounded-normal border border-gray p-4 flex-col gap-2'>
            <TouchableOpacity className='p-2 px-4 border border-primary rounded-normal flex-row gap-2 justify-center items-center'>
              <MenuIcon width={22} height={22} color={'#1C60DE'}/>
              <Text className='grow font-noto text-heading3 text-primary'>month</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{router.replace('/calendar/weekCalendar')}} className='p-2 px-4 border border-gray rounded-normal flex-row gap-2 justify-center items-center'>
              <GridIcon width={22} height={22} color={'#626262'}/>
              <Text className='grow font-noto text-heading3 text-subText'>week</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ transform: [{ translateY: -24 }] }} className="flex gap-2 items-center">
            <View className='h-[38vh]'>
              <Calendar
                calendarActiveDateRanges={[
                  {
                    startId: selectedDate,
                    endId: selectedDate,
                  },
                ]}
                calendarFirstDayOfWeek="sunday"
                calendarDayHeight={40}
                calendarRowVerticalSpacing={10}
                onCalendarDayPress={setSelectedDate}
                calendarMonthId={toDateId(currentMonth)}
                theme={linearTheme}
              />
            </View>
            <View className='flex justify-center items-center'>
              <View className='bg-nonFocus h-1 w-[20vw] rounded-full'></View>
            </View>
          </View>
          <View style={{ transform: [{ translateY: -18 }] }} className='flex-col gap-2'>
            <Text className='font-noto text-heading3'>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedDate))}</Text>
            <View className='h-28 w-full rounded-normal border border-gray bg-white'></View>
            <View className='h-28 w-full rounded-normal border border-gray bg-white'></View>
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
                <TouchableOpacity onPress={()=>{router.push('/camera')}} className='rounded-full p-1 px-4 bg-primary flex-row items-center justify-center gap-1'>
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
                {mealListDummy.map((data,i)=>(
                  <MealCard key={i} meal_id={data.meal_id} meal_date={data.meal_date} food_name={data.food_name} calorie={data.calorie} ai_create={data.ai_create}/>
                ))}
              </View>
            ):(
              <View className='w-full justify-center items-center gap-2 mt-2 pb-16'>
                {goalDataDummy.map((data,i)=>(
                  <CalendarGoalCard key={i} goal_id={data.goal_id} goal_name={data.goal_name} length_task={data.length_task} complete_task={data.complete_task}/>
                ))}
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
    length_task:8,
    complete_task:3,
  },
  {
    goal_id:'2',
    goal_name:'Title Test 2',
    length_task:8,
    complete_task:3,
  },
  {
    goal_id:'3',
    goal_name:'Title Test 3',
    length_task:8,
    complete_task:3,
  },
]

const mealListDummy = [
  {
    meal_id:'1',
    food_name:'กะเพราไก่',
    meal_date:new Date(),
    calorie:273,
    ai_create:true,
  },
  {
    meal_id:'2',
    food_name:'ไก่ย่าง ข้าวเหนียว',
    meal_date:new Date(),
    calorie:234,
    ai_create:false,
  },
]

const linearAccent = "#1C60DE";

const linearTheme: CalendarTheme = {
  rowMonth: {
    content: {
      textAlign: "left",
      color: "rgba(0, 0, 0, 1)",
      fontWeight: "700",
      display:'none'
    },
  },
  itemWeekName: { content: { color: "#B8C2D2" } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: linearAccent,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? linearAccent : "transparent",
        borderRadius: 12,
      },
      content: {
        color: isWeekend && !isPressed ? "rgba(0, 0, 0, 1)" : "#000",
        fontSize:14,
        fontWeight:600,
        fontFamily:'noto-sans-thai'
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: "rgba(0, 0, 0, 0)",
        borderRadius: isPressed ? 12 : 12,
        backgroundColor: isPressed ? linearAccent : "#B8C2D2",
      },
      content: {
        color: isPressed ? "#000" : "rgba(255, 255, 255, 1)",
        fontSize:16,
        fontWeight:600,
        fontFamily:'noto-sans-thai'
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }) => ({
      container: {
        backgroundColor: linearAccent,
        borderTopLeftRadius: isStartOfRange ? 16 : 0,
        borderBottomLeftRadius: isStartOfRange ? 16 : 0,
        borderTopRightRadius: isEndOfRange ? 16 : 0,
        borderBottomRightRadius: isEndOfRange ? 16 : 0,
      },
      content: {
        color: "#ffffff",
      },
    }),
  },
};

export default MonthCalendar