import { View, Text, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { router } from 'expo-router'
import { calendarGoalCardProp } from '../../types/goal'
import { useTheme } from '../../context/themeContext'
import * as Haptics from 'expo-haptics';

const CommunityGoalCard = ({goal_id, goal_name, total_task, complete_task}:calendarGoalCardProp) => {

  const percent = total_task > 0 ? Math.round((complete_task / total_task) * 100) : 0;

  const { colors } = useTheme();
  const color = percent === 100? colors.green : colors.yellow

  const progressBar = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (complete_task) {
      Animated.timing(progressBar, {
        toValue: percent,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [complete_task]);

  const progressBarWidth = progressBar.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const triggerLightHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  };

  const pressGoal = () => {
    triggerLightHaptics()
    router.push(`/community/user/goal/${goal_id}`)
  }

  return (
    <TouchableOpacity  onPress={pressGoal} style={{marginBottom: 8, backgroundColor:colors.white, borderColor:colors.gray}} className='h-32 w-full rounded-normal border justify-center items-center'>
      <View className='w-[92%] h-32 flex-col gap-1 justify-center'>
        <View className='flex-col w-full h-[80%]'>
          <View className='w-full h-[78%] flex-row items-center justify-center gap-1'>
            <View style={{width:'78%', height:'100%'}}>
              <Text
                style={{overflow: 'hidden', color:colors.text}}
                numberOfLines={2}
                ellipsizeMode="tail"
                className='font-noto text-heading2 line-clamp-2'
              >
                {goal_name}
              </Text>
            </View>
            <View style={{width:'22%'}} className=' grow items-end'>
              <Text style={{color:color}} className={`font-notoMedium text-subTitle`}>{percent}%</Text>
            </View>
          </View>
          <View className='flex-row w-full'>
            <Text style={{color:colors.subText}} className='text-detail font-noto'>{complete_task}/{total_task} completed</Text>
          </View>
        </View>
        <View className='h-[20%] relative'>
          <View style={{height:12, backgroundColor:colors.darkGray}} className='rounded-full w-full'/>
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

export default CommunityGoalCard