import { View, Text } from 'react-native'
import React from 'react'
import { CheckedIcon, FoodIcon } from '../../constants/icon'
import { useAuth } from '../../context/authContext'

const FoodGoal = () => {

  const color = ''

  const { user } = useAuth()
  const calorie_need = Math.floor(user?.calorie_need || 0)

  return (
    <View style={{paddingHorizontal:20, backgroundColor:'white' }} className='h-28 w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>
      <FoodIcon width={36} height={36} color={'#0dc47c'}/>

      <View style={{paddingLeft:10}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text className='text-subText font-noto'>calorie in day</Text>
        </View>
        <View className='flex-row gap-1 items-end'>
          <Text style={{color:'#0dc47c'}} className='text-title font-notoMedium'>2500</Text>
          <View style={{ transform: [{ translateY: -10 }], flexDirection:'row', display:'flex', gap:2, alignItems:'flex-end' }}>
            <Text style={{color:'#626262'}} className='text-body font-notoMedium'>of {calorie_need} cal</Text>
          </View>
        </View>
      </View>

      <View style={{ transform: [{ translateY: 0 }] }} className=' relative flex-col justify-center items-center'>
        <View style={{height:45, width:45, borderRadius:1000, backgroundColor:'#0dc47c'}} className='justify-center items-center'>
          <CheckedIcon width={20} height={20} color={'white'}/>
        </View>
      </View>
    </View>
  )
}

export default FoodGoal