import { View, Text, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import BackButton from '../../../components/Back'
import { router, useFocusEffect } from 'expo-router'
import { AddIcon, BackwardIcon, FoodIcon, ForwardIcon, LeftArrowIcon, RightArrowIcon } from '../../../constants/icon'
import WeekFoodChart from '../../../components/food/weekFoodChart'
import MealCard from '../../../components/food/mealCard'
import FoodToday from '../../../components/food/foodToday'
import FoodDaySummary from '../../../components/food/foodDaySummary'
import Animated, { useAnimatedRef, useAnimatedStyle, useScrollViewOffset, withTiming } from 'react-native-reanimated'

import { SERVER_URL } from '@env';
import axios from 'axios';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { MealSummaryCard, weekMealSummary } from '../../../types/food'
import { FlashList } from '@shopify/flash-list'
import { toDateId } from '@marceloterreiro/flash-calendar'
import { useTheme } from '../../../context/themeContext'
const getSundayDate = (date: Date): Date => startOfWeek(date, { weekStartsOn: 0 });

const FoodSummary = () => {

  const { colors } = useTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(scrollRef);
  const today = toDateId(new Date())

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHandler. value > 420 ? withTiming(1) : withTiming(0),
      backgroundColor:colors.background
    }
  })

  const [data, setData] = useState<weekMealSummary[]>([])
  const [weeklyTotal, setWeeklyTotal] = useState({
    total_calorie: 0, protein: 0, carbs: 0, fat: 0
  })
  const [currentSunday, setCurrentSunday] = useState<Date>(getSundayDate(new Date()));
  const [mealSummary, setMealSummary] = useState<MealSummaryCard>()
  const [graph, setGraph] = useState([0,0,0,0,0,0,0])

  const getSummaryMeal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/calendar/meal/summary/${today}`);
      const data = response.data

      // console.log('calendar/meal/summary \n',data);
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
      console.error(error)
    }
  }

  const getWeeklyTotal = (data: weekMealSummary[]) => {
    return data.reduce(
      (acc, day) => ({
        total_calorie: acc.total_calorie + day.total_calorie,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
      }),
      { total_calorie: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const fillWeekData = (data: weekMealSummary[], startDate: Date) => {
    const weekData = Array.from({ length: 7 }, (_, index) => {
      const currentDate = format(addDays(startDate, index), "yyyy-MM-dd");
      return (
        data.find((item) => item.date === currentDate) ?? {
          date: currentDate,
          carbs: 0,
          fat: 0,
          protein: 0,
          total_calorie: 0,
          meal: [],
        }
      );
    });
  
    setGraph(weekData.map((day) => day.total_calorie));
  
    return weekData;
  };

  const getWeeklyMeal = async () => {
    const formattedDate = format(currentSunday, 'yyyy-MM-dd');
    try {
      const response = await axios.get(`${SERVER_URL}/menu/meal/weekly/${formattedDate}`);
      const data = response.data

      if (data.message === "No meals found") {
        setData(fillWeekData([], currentSunday));
        setWeeklyTotal(getWeeklyTotal([]))
        return (
          console.warn(' No meals found ')
        )
      }

      setData(fillWeekData(data, currentSunday))

      setWeeklyTotal(getWeeklyTotal(data))

    } catch (error: any){
      console.error(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getSummaryMeal()
      getWeeklyMeal()
    }, [currentSunday])
  );

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <View className='w-[92%]'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/menu'}/>
          </View>
          <View className='my-2 mt-3 flex-row justify-center items-center'>
            <View className='grow'>
              <Text className='text-subTitle text-primary font-notoMedium'>your meal</Text>
            </View>
            <View>
              <TouchableOpacity onPress={()=>{router.push('/calendar/addMeal')}} className='rounded-full p-1 px-4 bg-primary flex-row items-center justify-center gap-1'>
                <Text className='text-white font-noto text-heading3'>add meal</Text>
                <AddIcon width={22} height={22} color={'#fff'}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className='w-[92%]'>
          <Animated.View style={[buttonStyle]} className='w-full absolute top-0 z-10 bg-Background'>
            <SummaryHeader weeklyTotal={weeklyTotal} currentSunday={currentSunday} setCurrentSunday={setCurrentSunday}/>
          </Animated.View>
        </View>
        <ScrollView
          ref={scrollRef}
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          <View className='gap-2'>
            <View className='flex-row mb-1'>
              <View className='grow'>
                <Text style={{color:colors.text}} className=' text-heading3 font-noto'>Meal today</Text>
              </View>
              <Text style={{color:colors.subText}} className='font-noto'>
                {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
              </Text>
            </View>
            {mealSummary &&
              <FoodToday total_calorie={mealSummary?.total_calorie} total_protein={mealSummary?.total_protein} total_carbs={mealSummary?.total_carbs} total_fat={mealSummary?.total_fat}/>
            }
            {/* <MealCard meal_id={''} meal_date={new Date().toDateString()} food_name={'TestMeal'} calorie={435} createByAI={true}/> */}
          </View>


          <View style={{height:1, width:'100%',marginVertical:10, backgroundColor:colors.gray}} className=' mb-2'/>

          <SummaryHeader weeklyTotal={weeklyTotal} currentSunday={currentSunday} setCurrentSunday={setCurrentSunday}/>

          <View style={{backgroundColor:colors.background, borderColor:colors.gray}} className='p-4 border rounded-normal'>
            <View className='flex flex-row gap-2 items-center mb-2'>
              <FoodIcon width={15} height={15} color={colors.green}/>
              <Text style={{color:colors.text}} className='text-body font-noto '>calorie in week</Text>
            </View>
            <View >
              <WeekFoodChart graph={graph}/>
            </View>
          </View>
          <View className='gap-2 pb-16 mt-2'>
            {data.length != 0 ? (
              <FlashList
                data={data}
                renderItem={({ item }) =>
                  <View className='my-1'>
                    <FoodDaySummary date={item.date} total_calorie={item.total_calorie} protein={item.protein} carbs={item.carbs} fat={item.fat} meal={item.meal}/>
                  </View>
                }
                estimatedItemSize={200}
              />
              ):(
                <View>
                  <Text> No data </Text>
                </View>
              )
            }
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

type weeklyTotalProp = {
  total_calorie: number
  protein: number
  carbs: number
  fat: number
}
type SummaryHeaderProp = {
  weeklyTotal:weeklyTotalProp
  currentSunday:Date
  setCurrentSunday:(currentSunday:Date) => void
}

const SummaryHeader = ({weeklyTotal, currentSunday, setCurrentSunday}:SummaryHeaderProp) => {

  const { colors } = useTheme();

  const handlePrevWeek = (): void => {
    const prevSunday = subDays(currentSunday, 7);
    setCurrentSunday(prevSunday);
  };

  const handleNextWeek = (): void => {
    const nextSunday = addDays(currentSunday, 7);
    setCurrentSunday(nextSunday);
  };

  const endOfWeek = addDays(currentSunday, 6);

  return (
    <View className=''>
      <View className='flex-row items-center'>
        <View className='grow'>
          <Text style={{color:colors.text}} className='font-notoMedium text-heading2'>Summary</Text>
          <Text style={{color:colors.text}} className='font-noto text-heading3 pl-1'>
            {format(currentSunday, 'd MMM yyyy')} - {format(endOfWeek, 'd MMM yyyy')}
          </Text>
        </View>
        <View className='flex-row gap-3 pr-2'>
          <TouchableOpacity onPress={handlePrevWeek}>
            <BackwardIcon width={34} height={34} color={colors.primary}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextWeek}>
            <ForwardIcon width={34} height={34} color={colors.primary}/>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View style={{ transform: [{ translateY: 6 }]}}>
          <Text style={{color:colors.subText}} className=' font-noto text-detail'>Total Calories</Text>
        </View>
        <View className='flex-row'>
          <View className='flex-row items-end'>
            <Text style={{color:colors.green}} className='font-notoMedium text-subTitle'>{weeklyTotal.total_calorie}</Text>
            <View style={{ transform: [{ translateY: -6 }]}}><Text style={{color:colors.subText}} className='font-noto text-body pl-1'>cal</Text></View>
          </View>
          <View style={{ transform: [{ translateY: -6 }]}} className='flex-row items-end ml-3'>
            <Text style={{color:colors.subText}} className=' font-notoLight text-detail pl-1'>Protein :</Text>
            <Text style={{color:colors.subText}} className=' font-noto text-body pl-1'>{weeklyTotal.protein}</Text>
            <Text style={{color:colors.subText}} className=' font-noto text-detail pl-1'>g</Text>
          </View>
          <View style={{ transform: [{ translateY: -6 }]}} className='flex-row items-end'>
            <Text style={{color:colors.subText}} className=' font-notoLight text-detail pl-1'>Carbs :</Text>
            <Text style={{color:colors.subText}} className=' font-noto text-body pl-1'>{weeklyTotal.carbs}</Text>
            <Text style={{color:colors.subText}} className=' font-noto text-detail pl-1'>g</Text>
          </View>
          <View style={{ transform: [{ translateY: -6 }]}} className='flex-row items-end'>
            <Text style={{color:colors.subText}} className=' font-notoLight text-detail pl-1'>Fat :</Text>
            <Text style={{color:colors.subText}} className=' font-noto text-body pl-1'>{weeklyTotal.fat}</Text>
            <Text style={{color:colors.subText}} className=' font-noto text-detail pl-1'>g</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default FoodSummary