import { View, Text, Animated, TouchableWithoutFeedback, Easing, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NightIcon, BackwardIcon, ForwardIcon  } from '../../constants/icon'
import WeekSleepChart from './weekSleepChart'
import { useTheme } from '../../context/themeContext'
import { addDays, format, startOfWeek, subDays } from 'date-fns'
import axios from 'axios'
import { SERVER_URL } from '@env'
import { useAuth } from '../../context/authContext'
import { sleepDatabase } from '../../types/sleep'
import { useFocusEffect } from 'expo-router'

const getSundayDate = (date: Date): Date => startOfWeek(date, { weekStartsOn: 0 });

type sleepGetProp = {
  date:string
  total_time:number
  sleep:any
}
const SleepSummary = () => {

  const { colors } = useTheme();
  const { user } = useAuth();

  const [graph, setGraph] = useState([0,0,0,0,0,0,0])
  const [totalTime, setTotalTime] = useState(0)

  const [currentSunday, setCurrentSunday] = useState<Date>(getSundayDate(new Date()));

  const handlePrevWeek = (): void => {
    setCurrentSunday(prev => subDays(prev, 7));
  };

  const handleNextWeek = (): void => {
    setCurrentSunday(prev => addDays(prev, 7));
  };

  const endOfWeek = addDays(currentSunday, 6);

  const fillWeekData = (data: sleepGetProp[], startDate: Date) => {
    const weekData = Array.from({ length: 7 }, (_, index) => {
      const currentDate = format(addDays(startDate, index), "yyyy-MM-dd");
      return (
        data.find((item) => item.date === currentDate) ?? {
          total_time: 0,
        }
      );
    });
  
    return setGraph(weekData.map((day) => day.total_time / 60));
  };

  const getWeeklyTime = async () => {
    const formattedDate = format(currentSunday, 'yyyy-MM-dd');
    console.log(`${SERVER_URL}/sleep/total-time?date=${formattedDate}&id=${user?._id}`);

    try {
      const response = await axios.get(`${SERVER_URL}/sleep/total-time?date=${formattedDate}&id=${user?._id}`);
      const data = response.data

      if (data.message === "No sleep found") {
        setGraph([0,0,0,0,0,0,0])
        setTotalTime(0)
        return (
          console.warn(' No sleep found ')
        )
      }

      fillWeekData(data, currentSunday);
      setTotalTime(data.reduce((sum:number, day:sleepGetProp) => sum + (day.total_time || 0), 0));

    } catch (error: any){
      console.error(error)
    }
  }

  // useEffect(()=>{
  //   getWeeklyTime()
  // },[currentSunday])

  useFocusEffect(
    useCallback(() => {
      getWeeklyTime()
    }, [currentSunday])
  );

  return (
    <View style={{paddingHorizontal:15, paddingVertical:12, backgroundColor:colors.white, borderColor:colors.gray }} className=' w-full rounded-normal border p-2 justify-center items-center flex-row gap-2'>
      <View className='grow'>
        <View className=' relative flex flex-row gap-2 items-center justify-between ' >
          <View className='flex flex-row gap-1 items-center'>
            <NightIcon width={15} height={15} color={colors.night}/>
            <Text style={{color:colors.text}} className='text-heading3 font-noto '>Sleep time</Text>
          </View>
          <View style={{ transform: [{ translateY: 2 },{ translateX: 6 }]}} className='right-0 absolute flex flex-row gap-4 items-center'>
            <TouchableOpacity onPress={handlePrevWeek}>
              <BackwardIcon width={34} height={34} color={colors.darkGray}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextWeek}>
              <ForwardIcon width={34} height={34} color={colors.darkGray}/>
            </TouchableOpacity>
          </View>
        </View>
        <View className='mt-2'>
        <View style={{marginLeft:6}}>
          <Text style={{color:colors.subText}} className='font-noto'>
            {format(currentSunday, 'd MMM yyyy')} - {format(endOfWeek, 'd MMM yyyy')}
          </Text>
          <View style={{ transform: [{ translateY: -6 }] }} className='flex-row gap-1 items-end'>
            <Text style={{color:colors.night}} className='text-title font-notoMedium'>{Math.floor(totalTime / 60) || 0}</Text>
            <View style={{ transform: [{ translateY: -10 }] }}>
              <Text style={{color:colors.subText}} >h</Text>
            </View>
            <Text style={{color:colors.night}} className='text-title font-notoMedium'>{(totalTime % 60) || 0}</Text>
            <View style={{ transform: [{ translateY: -10 }] }}>
              <Text style={{color:colors.subText}} >m</Text>
            </View>
          </View>
        </View>
          <WeekSleepChart graph={graph}/>
        </View>
    </View>


    </View>
  )
}


export default SleepSummary