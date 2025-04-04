import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AddIcon } from '../../constants/icon'
import { GoalCreateCardProp } from '../../types/goal'
import { router } from 'expo-router'
import { useTheme } from '../../context/themeContext'
import * as Haptics from 'expo-haptics';

export const calculateDuration = (start_date: string | Date, end_date: string | Date) => {
  const start = new Date(start_date);
  const end = new Date(end_date);

  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 30) {
    return `${Math.round(diffInDays)} day`;
  }

  const months = Math.floor(diffInDays / 30);
  const days = Math.round(diffInDays % 30);
  return `${months} month ${days} day`;
};


const GoalCreateCard = ({goal_id, goal_name, start_date, end_date, total_task, create_by}:GoalCreateCardProp) => {

  const { colors } = useTheme();
  const duration = calculateDuration(start_date, end_date)

  const triggerLightHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  };

  const pressGoal = () => {
    triggerLightHaptics()
    router.push(`/home/goal/create/${goal_id}`)
  }

  return (
    <TouchableOpacity onPress={pressGoal} style={{marginBottom: 8, backgroundColor:colors.background,borderColor:colors.gray}} className='h-32 p-4 w-full justify-center rounded-normal border border-gray bg-white flex-row'>
      <View style={{width:'89%', height:'100%'}} className='flex justify-center items-start'>
        <View style={{width:'100%', height:'70%'}} className='justify-center'>
          <Text
            style={{overflow: 'hidden', color:colors.text}}
            numberOfLines={2}
            ellipsizeMode="tail"
            className='font-noto text-heading2 line-clamp-2'
          >
            {goal_name}
          </Text>
        </View>
        <Text style={{color:colors.subText}} className='text-detail font-noto'>create by : {create_by}</Text>
        <Text style={{color:colors.subText}} className='text-detail font-noto'>{total_task} Task duration : {duration}</Text>
      </View>
      <View style={{width:'10%', height:'100%'}} className=' justify-center items-end'>
        <AddIcon color={'#1C60DE'}/>
      </View>
    </TouchableOpacity>
  )
}

export default GoalCreateCard