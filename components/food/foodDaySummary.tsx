import { View, Text } from 'react-native'
import React from 'react'
import { RightArrowIcon } from '../../constants/icon'
import { format } from 'date-fns'

const FoodDaySummary = () => {
  return (
    <View className='px-4 py-2 bg-white border border-gray rounded-normal flex-row'>
      <View className='grow'>
        <Text className='text-subText font-noto'>{format(new Date(), "eee '|' dd MMM yyyy")}</Text>
        <View className='flex-row gap-2 items-end'>
          <Text className='text-body font-noto text-subText'>Total Calories</Text>
          <View style={{ transform: [{ translateY: 2 }]}}>
            <Text className='text-heading2 font-noto'>3333</Text>
          </View>
          <View style={{ transform: [{ translateY: 0 }]}}>
            <Text className='text-body font-noto text-subText'>cal</Text>
          </View>
        </View>
        <View style={{ transform: [{ translateY: -2 }], flexDirection:'row', gap:12, marginTop:2 }}>
          <Text style={{color:'gray'}} className='text-detail font-notoLight'>Protein : 12g</Text>
          <Text style={{color:'gray'}} className='text-detail font-notoLight'>Carbs : 24g</Text>
          <Text style={{color:'gray'}} className='text-detail font-notoLight'>Fat : 9g</Text>
        </View>
      </View>
      <View style={{paddingRight:0}} className='flex flex-row gap-1 items-center'>
      <RightArrowIcon width={20} height={20} color={'#CFCFCF'}/>
      </View>
    </View>
  )
}

export default FoodDaySummary