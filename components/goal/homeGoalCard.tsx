import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { router } from 'expo-router'
import { homeGoalCardProp } from '../../types/goal'
import { format } from 'date-fns'
import { useTheme } from '../../context/themeContext'


const HomeGoalCard = ({goal_id, goal_name, end_date, total_task, complete_task}:homeGoalCardProp) => {

  const { colors } = useTheme();

  const percent = total_task > 0 ? Math.round((complete_task / total_task) * 100) : 0;
  const today = new Date();
  const end = new Date(end_date);
  end.setDate(end.getDate() + 1);

  const color = percent === 100? "#0dc47c" : today > end? "#f43168" : "#FBA742"

  const progressBar = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (percent !== 0) {
      Animated.timing(progressBar, {
        toValue: percent,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      progressBar.setValue(0);
    }
  }, [percent]);

  const progressBarWidth = progressBar.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity  onPress={()=>{router.push(`/home/goal/${goal_id}`)}} style={{marginBottom: 8, backgroundColor:colors.white, borderColor:colors.gray}} className='h-32 w-full rounded-normal border justify-center items-center'>
      <View className='w-[92%] h-32 flex-col gap-1 justify-center'>
        <View className='flex-col w-full h-[80%]'>
          <View className='w-full h-[78%] flex-row items-center justify-center gap-1'>
            <View style={{width:'76%', height:'100%'}}>
              <Text
                style={{overflow: 'hidden',color:colors.text}}
                numberOfLines={2}
                ellipsizeMode="tail"
                className='font-noto text-heading2 line-clamp-2 '
              >
                {goal_name}
              </Text>
            </View>
            <View style={{width:'24%'}} className=' grow items-end'>
              <Text style={{color:color}} className={`font-notoMedium text-subTitle`}>{percent}%</Text>
            </View>
          </View>
          <View className='flex-row w-full'>
            <Text style={{color:colors.subText}} className='text-detail font-noto grow'>end : {format(end_date, 'd MMMM yyyy')}</Text>
            <Text style={{color:colors.subText}} className='text-detail font-not'>{complete_task}/{total_task} completed</Text>
          </View>
        </View>
        <View className='h-[20%] relative'>
          <View style={{height:12}} className='rounded-full w-full bg-DarkGray'/>
          <Animated.View
            style={{
            position: 'absolute',
            top: 0,
            height: 12,
            borderRadius: 6,
            backgroundColor: color,
            width: progressBarWidth,
            }}
          ></Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default HomeGoalCard