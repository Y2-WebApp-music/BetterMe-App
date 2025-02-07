import { Text, TouchableOpacity, View } from 'react-native';
import { BackwardIcon, FoodIcon, ForwardIcon } from '../../constants/icon';
import WeekFoodChart from './weekFoodChart';

import { SERVER_URL } from '@env';
import axios from 'axios';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { weekMealSummary } from '../../types/food';
const getSundayDate = (date: Date): Date => startOfWeek(date, { weekStartsOn: 0 });

const FoodSummary = () => {

  const [data, setData] = useState<weekMealSummary[]>([])
  const [currentSunday, setCurrentSunday] = useState<Date>(getSundayDate(new Date()));
  const [graph, setGraph] = useState([0,0,0,0,0,0,0])
  const [weeklyTotal, setWeeklyTotal] = useState({
    total_calorie: 0, protein: 0, carbs: 0, fat: 0
  })

  const handlePrevWeek = (): void => {
    setCurrentSunday(prev => subDays(prev, 7));
  };

  const handleNextWeek = (): void => {
    setCurrentSunday(prev => addDays(prev, 7));
  };

  const updateGraphData = (weekData: weekMealSummary[]) => {
    const calories = weekData.map(day => day.total_calorie || 0);
    
    while (calories.length < 7) {
      calories.push(0);
    }

    console.log(calories);
  
    setGraph(calories);
  };

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
          total_calorie: 0,
        }
      );
    });
  
    return setGraph(weekData.map((day) => day.total_calorie));
  };

  const getWeeklyMeal = async () => {
    const formattedDate = format(currentSunday, 'yyyy-MM-dd');
    try {
      const response = await axios.get(`${SERVER_URL}/menu/meal/weekly/${formattedDate}`);
      const data = response.data

      if (data.message === "No meals found") {
        setData([]);
        setWeeklyTotal(getWeeklyTotal([]))
        updateGraphData([])
        return (
          console.warn(' No meals found ')
        )
      }

      console.log(data);

      setData(data)
      setWeeklyTotal(getWeeklyTotal(data))
      fillWeekData(data, currentSunday)

    } catch (error: any){
      console.error(error)
    }
  }

  const endOfWeek = addDays(currentSunday, 6);

  useEffect(()=>{
    getWeeklyMeal()
  },[currentSunday])

  return (
    <View style={{paddingHorizontal:15, paddingVertical:12, backgroundColor:'white' }}  className=' w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>
      <View className='grow'>
        <View className='flex flex-row gap-2 items-center justify-between ' >
          <View className='flex flex-row gap-1 items-center'>
            <FoodIcon width={15} height={15} color={'#0dc47c'}/>
            <Text className='text-body font-noto '>calorie in week</Text>
          </View>
          <View style={{ transform: [{ translateY: 2 },{ translateX: 6 }]}} className='right-0 absolute flex flex-row gap-4 items-center'>
            <TouchableOpacity onPress={handlePrevWeek}>
              <BackwardIcon width={34} height={34} color={'#CFCFCF'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextWeek}>
              <ForwardIcon width={34} height={34} color={'#CFCFCF'}/>
            </TouchableOpacity>
            </View>
        </View>
        <View className='mt-2'>
          <View style={{marginLeft:4}}>
            <Text className='font-noto text-subText'>
              {format(currentSunday, 'd MMM yyyy')} - {format(endOfWeek, 'd MMM yyyy')}
            </Text>
            <View style={{ transform: [{ translateY: -6 }] }} className='flex-row gap-1 items-end'>
              <Text style={{color:'#0dc47c'}} className='text-title font-notoMedium'>{weeklyTotal.total_calorie}</Text>
              <View style={{ transform: [{ translateY: -10 }] }}>
                <Text className='text-subText'>cal</Text>
              </View>
            </View>
          </View>
          <View>
            <WeekFoodChart graph={graph}/>
          </View>
        </View>
    </View>


    </View>
  )
}


export default FoodSummary