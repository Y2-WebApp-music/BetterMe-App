import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { format } from 'date-fns';
import { mealCard } from '../../types/food';
import { useTheme } from '../../context/themeContext';

const MealCard = ({meal_id, meal_date, food_name, calorie, createByAI}:mealCard) => {

  const { colors } = useTheme();
  const formattedTime = format(new Date(meal_date), 'HH:mm');

  const AICreate = createByAI? colors.primary:colors.green

  return (
    <TouchableOpacity onPress={()=>{router.push(`/calendar/meal/${meal_id}`)}} style={{padding:12, paddingHorizontal:20, marginBottom: 8, width:'100%', backgroundColor:colors.background, borderColor:colors.gray}} className='rounded-normal border flex-row items-center justify-center'>
      <View style={{width:'80%'}} className='max-w-[64vw] grow'>
        <View className='flex-row gap-1 items-center'>
          <View style={{width:12, height:12,backgroundColor:AICreate}} className={`rounded-full flex justify-center items-center`}>
            <View style={{width:6, height:6, backgroundColor:colors.white}} className='rounded-full'/>
          </View>
          <Text  style={{color: colors.subText}} className=' text-body font-notoMedium'>{formattedTime}</Text>
          <Text style={{color: colors.darkGray}}>: from {createByAI? 'Ai':'User'}</Text>
        </View>
        <View>
          <Text
            style={{overflow: 'hidden',color:colors.text}}
            numberOfLines={2}
            ellipsizeMode="tail"
            className='font-noto text-heading3 line-clamp-2'>{food_name}</Text>
        </View>
      </View>
      <View className='w-[20vw] justify-end items-end '>
        <Text style={{color:colors.darkGray}} className='text-heading2 font-notoMedium'>{calorie} Cal</Text>
      </View>
    </TouchableOpacity>
  )
}

export default MealCard