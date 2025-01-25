import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { format } from 'date-fns';
import { mealCard } from '../../types/food';

const MealCard = ({meal_id, meal_date, food_name, calorie, createByAI}:mealCard) => {

  const formattedTime = format(new Date(meal_date), 'HH:mm');

  const AICreate = createByAI? '#1c60de':'#0dc47c'

  return (
    <TouchableOpacity onPress={()=>{router.push(`/calendar/meal/${meal_id}`)}} style={{padding:12, paddingHorizontal:20, marginBottom: 8, width:'100%'}} className='rounded-normal border border-gray bg-white flex-row items-center justify-center'>
      <View style={{width:'80%'}} className='max-w-[64vw] grow'>
        <View className='flex-row gap-1 items-center'>
          <View style={{width:12, height:12,backgroundColor:AICreate}} className={`rounded-full flex justify-center items-center`}>
            <View style={{width:6, height:6}} className='bg-white rounded-full'/>
          </View>
          <Text className='text-subText text-body font-notoMedium'>{formattedTime}</Text>
          <Text style={{color: '#CFCFCF'}} className='text-DarkGray'>: from {createByAI? 'Ai':'User'}</Text>
        </View>
        <View>
          <Text
            style={{overflow: 'hidden',}}
            numberOfLines={2}
            ellipsizeMode="tail"
            className='font-noto text-heading3 line-clamp-2'>{food_name}</Text>
        </View>
      </View>
      <View className='w-[20vw] justify-end items-end '>
        <Text style={{color:'#ABABAB'}} className='text-heading2 font-notoMedium'>{calorie} Cal</Text>
      </View>
    </TouchableOpacity>
  )
}

export default MealCard