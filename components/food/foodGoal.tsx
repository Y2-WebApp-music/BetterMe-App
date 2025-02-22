import { View, Text } from 'react-native'
import React from 'react'
import { CheckedIcon, FoodIcon } from '../../constants/icon'
import { useAuth } from '../../context/authContext'
import { useTheme } from '../../context/themeContext'

type FoodGoalProp = {
  totalCal:number
}

const FoodGoal = ({totalCal}:FoodGoalProp) => {

  const { colors } = useTheme();
  const { user } = useAuth()
  const calorie_need = Math.floor(user?.calorie_need || 0)
  const color = totalCal < calorie_need? colors.text: calorie_need === totalCal ? '#0dc47c' : '#fba742'
  

  return (
    <View style={{paddingHorizontal:20, backgroundColor:colors.white, borderColor:colors.gray }} className='h-28 w-full rounded-normal border p-2 justify-center items-center flex-row gap-2'>
      <FoodIcon width={36} height={36} color={'#0dc47c'}/>

      <View style={{paddingLeft:10}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text style={{color:colors.subText}} className=' font-noto'>calorie in day</Text>
        </View>
        <View className='flex-row gap-1 items-end'>
          <Text style={{color:color}} className='text-title font-notoMedium'>{totalCal || 0}</Text>
          <View style={{ transform: [{ translateY: -10 }], flexDirection:'row', display:'flex', gap:2, alignItems:'flex-end' }}>
            <Text style={{color:colors.subText}} className='text-body font-notoMedium'>of {calorie_need} cal</Text>
          </View>
        </View>
      </View>

      <View style={{ transform: [{ translateY: 0 }] }} className=' relative flex-col justify-center items-center'>
        <View style={{height:45, width:45, borderRadius:1000, backgroundColor:colors.green}} className='justify-center items-center'>
          <CheckedIcon width={20} height={20} color={'white'}/>
        </View>
      </View>
    </View>
  )
}

export default FoodGoal