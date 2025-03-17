import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import BackButton from '../../../components/Back'
import { BackwardIcon, ForwardIcon, NightIcon } from '../../../constants/icon'
import SleepToday from '../../../components/sleep/sleepToday'
import WeekSleepChart from '../../../components/sleep/weekSleepChart'
import SleepDaySummary from '../../../components/sleep/sleepDaySummary'
import Animated, { useAnimatedRef, useAnimatedStyle, useScrollViewOffset, withTiming } from 'react-native-reanimated'
import { useTheme } from '../../../context/themeContext'
import EditSleepModal from '../../../components/modal/EditSleepModal'
import { preventAutoHideAsync } from 'expo-router/build/utils/splash'
import { sleepCard, sleepCardDisplay, sleepDatabase } from '../../../types/sleep'
import axios from 'axios'
import { SERVER_URL } from '@env'
import { addDays, format, startOfWeek, subDays } from 'date-fns'
import { useFocusEffect } from 'expo-router'
import { useAuth } from '../../../context/authContext'
import { FlashList } from '@shopify/flash-list'

const getSundayDate = (date: Date): Date => startOfWeek(date, { weekStartsOn: 0 });

type WeeklyTotal = {
  total_time: number;
  start_time: string | null;
  end_time: string | null;
  avg_time: number;
};

const SleepSummary = () => {

  const { user } = useAuth()
  const { colors } = useTheme();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(scrollRef);

  const [currentSunday, setCurrentSunday] = useState<Date>(getSundayDate(new Date()));

  const [weekData, setWeekData] = useState<sleepCardDisplay[]>([])
  const [graph, setGraph] = useState([0,0,0,0,0,0,0])
  const [weeklyTotal, setWeeklyTotal] = useState<WeeklyTotal>({
    total_time: 0, start_time: null, end_time: null, avg_time: 0
  })

  const fillWeekData = (data: sleepDatabase[], startDate: Date) => {
    const weekData = Array.from({ length: 7 }, (_, index) => {
      const currentDate = format(addDays(startDate, index), "yyyy-MM-dd");
  
      const matchedData = data.find((item) => {
        const sleepDate = format(new Date(item.sleep_date), "yyyy-MM-dd");
        return sleepDate === currentDate;
      });
  
      return matchedData
        ? {
            sleep_id: matchedData.sleep_id,
            total_time: matchedData.total_time,
            sleep_date: currentDate,
            start_time: matchedData.start_time,
            end_time: matchedData.end_time,
            create_by: matchedData.create_by,
          }
        : {
            sleep_id: "",
            total_time: 0,
            sleep_date: currentDate,
            start_time: null,
            end_time: null,
            create_by: "",
          };
    });
  
    setGraph(weekData.map((day) => day.total_time / 60));
  
    return weekData;
  };

  const calculateWeeklyTotal = (sleepData: sleepDatabase[]): WeeklyTotal => {
    if (sleepData.length === 0) {
        return { total_time: 0, start_time: null, end_time: null, avg_time: 0 };
    }

    let total_time = 0;
    let startTimes: number[] = [];
    let endTimes: number[] = [];

    sleepData.forEach(({ total_time: sleepTime, start_time, end_time }) => {
        total_time += sleepTime;
        startTimes.push(new Date(start_time).getTime());
        endTimes.push(new Date(end_time).getTime());
    });

    const avgStartTime = new Date(startTimes.reduce((a, b) => a + b, 0) / startTimes.length).toISOString();
    const avgEndTime = new Date(endTimes.reduce((a, b) => a + b, 0) / endTimes.length).toISOString();
    const avg_time = Math.round(total_time / sleepData.length);

    return { total_time, start_time: avgStartTime, end_time: avgEndTime, avg_time };
  };

  const getWeeklyData = async () => {
    const formattedDate = format(currentSunday, 'yyyy-MM-dd');
    console.log(`${SERVER_URL}/sleep/weekly?date=${formattedDate}&id=${user?._id}`);
    
    try {
      const response = await axios.get(`${SERVER_URL}/sleep/weekly?date=${formattedDate}&id=${user?._id}`);
  
      const data = response.data
      
      if (data.message === "No sleep found") {
        setWeekData(fillWeekData([], currentSunday))
        setWeeklyTotal({total_time: 0, start_time: null, end_time: null, avg_time: 0})
        return (
          console.warn('No sleep found')
        )
      }

      console.log('data ',data);
      
      setWeeklyTotal(calculateWeeklyTotal(data))
      setWeekData(fillWeekData(data, currentSunday))
  
    } catch(error) {
      console.error('getWeeklyData error',error)
    }
  }

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHandler. value > 330 ? withTiming(1) : withTiming(0),
    }
  });

  useFocusEffect(
    useCallback(() => {
      getWeeklyData()
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
              <Text className='text-subTitle text-primary font-notoMedium'>your sleep</Text>
            </View>
          </View>
        </View>

        <View className='w-[92%]'>
          <Animated.View style={[buttonStyle,{backgroundColor:colors.background}]} className='w-full absolute top-0 z-10'>
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
                <Text style={{color:colors.text}} className=' text-heading3 font-noto'>Last Night</Text>
              </View>
              <Text style={{color:colors.subText}} className=' font-noto'>
                {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
              </Text>
            </View>
            <SleepToday/>
          </View>


          <View style={{height:1, width:'100%', backgroundColor:colors.gray}} className=' my-2'/>

          <SummaryHeader weeklyTotal={weeklyTotal} currentSunday={currentSunday} setCurrentSunday={setCurrentSunday}/>

          <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className='p-4 border rounded-normal'>
            <View className='flex flex-row gap-2 items-center mb-2'>
              <NightIcon width={15} height={15} color={colors.night}/>
              <Text style={{color:colors.text}} className='text-body font-noto'>Sleep Time</Text>
            </View>
            <View >
              <WeekSleepChart graph={graph}/>
            </View>
          </View>

          <View className='gap-2 pb-16 mt-2'>
            {weekData.length != 0 ? (
              <FlashList
                data={weekData}
                renderItem={({ item }) =>
                  <View className='my-1'>
                    <SleepDaySummary sleep_id={item.sleep_id} total_time={item.total_time} sleep_date={item.sleep_date} start_time={item.start_time} end_time={item.end_time} create_by={item.create_by}/>
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
  total_time: number
  start_time: string | null
  end_time: string | null
  avg_time: number
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

  const [totalTime, setTotalTime] = useState({ hours: 0, minutes: 0 });
  const [avgTime, setAvgTime] = useState({ hours: 0, minutes: 0 });

  useEffect(()=>{
    setTotalTime({
      hours: Math.floor(weeklyTotal.total_time / 60 || 0),
      minutes: weeklyTotal.total_time % 60 || 0,
    });
    setAvgTime({
      hours: Math.floor(weeklyTotal.avg_time / 60 || 0),
      minutes: weeklyTotal.avg_time % 60 || 0,
    });
  },[weeklyTotal])

  return (
    <View className='my-2'>
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

      <View className='flex-row gap-5 items-center'>
        <View style={{ transform: [{ translateY: 6 }]}}>
          <Text style={{color:colors.subText}} className='font-noto text-detail'>Total sleep time</Text>
          <View className='flex-row items-end gap-1'>
            <Text style={{color:colors.night}} className=' font-notoMedium text-title'>{totalTime.hours}</Text>
            <View style={{ transform: [{ translateY: -8 }]}}>
              <Text style={{color:colors.subText}} className=' font-noto'>h</Text>
            </View>
            <Text style={{color:colors.night}} className=' font-notoMedium text-title'>{totalTime.minutes}</Text>
            <View style={{ transform: [{ translateY: -8 }]}}>
              <Text style={{color:colors.subText}} className=' font-noto'>m</Text>
            </View>
          </View>
        </View>
        <View style={{ transform: [{ translateY: 6 }]}}>
          <Text style={{color:colors.subText}} className=' font-noto text-detail'>Average time</Text>
          <View className='flex-row items-end gap-1'>
            <Text style={{color:colors.text}} className='font-noto text-subTitle'>{avgTime.hours}</Text>
            <View style={{ transform: [{ translateY: -6 }]}}>
              <Text style={{color:colors.subText}} className=' font-noto'>h</Text>
            </View>
            <Text style={{color:colors.text}} className='font-noto text-subTitle'>{avgTime.minutes}</Text>
            <View style={{ transform: [{ translateY: -6 }]}}>
              <Text style={{color:colors.subText}} className=' font-noto'>m</Text>
            </View>
          </View>
        </View>
        <View className='flex-row gap-3'>
          <View style={{ transform: [{ translateY: 6 }]}} className=' items-center'>
            <Text style={{color:colors.subText}} className=' font-noto text-detail'>wake up</Text>
            <View className='flex-row items-end gap-1'>
              <Text style={{color:colors.subText}} className='font-noto text-heading2'>{weeklyTotal.end_time? format(weeklyTotal.end_time, 'HH:mm') : `--:--`}</Text>
            </View>
          </View>
          <View style={{ transform: [{ translateY: 6 }]}} className=' items-center'>
            <Text style={{color:colors.subText}} className=' font-noto text-detail'>sleep</Text>
            <View className='flex-row items-end gap-1'>
              <Text style={{color:colors.subText}} className='font-noto text-heading2 '>{weeklyTotal.start_time? format(weeklyTotal.start_time, 'HH:mm') : `--:--`}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SleepSummary