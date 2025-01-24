import { View, Text } from 'react-native'
import React from 'react'
import { DayIcon, NightIcon, PenIcon, RightArrowIcon } from '../../constants/icon'
import { format } from 'date-fns'

const SleepDaySummary = () => {
  return (
    <View style={{paddingVertical:10}} className='px-4 bg-white border border-gray rounded-normal flex-row items-center'>
      <View className='grow'>
        <Text className='text-subText font-noto'>{format(new Date(), "eee '|' dd MMM yyyy")}</Text>
        <View style={{ transform: [{ translateY: 0 }]}} className='flex-row gap-1 items-end'>
          <Text className='text-detail font-noto text-subText'>Total time</Text>
          <View style={{ transform: [{ translateY: 4 }]}}>
            <Text className='text-heading font-noto'>3</Text>
          </View>
          <View style={{ transform: [{ translateY: 0 }]}}>
            <Text className='text-body font-noto text-subText'>h</Text>
          </View>
          <View style={{ transform: [{ translateY: 4 }]}}>
            <Text className='text-heading font-noto'>33</Text>
          </View>
          <View style={{ transform: [{ translateY: 0 }]}}>
            <Text className='text-body font-noto text-subText'>m</Text>
          </View>
        </View>
      </View>

      <View style={{ transform: [{ translateY: 6 }]}} className='items-center grow'>
        <View className='flex flex-row gap-1 items-center'>
          <NightIcon  width={12} height={12} color={'#454ab6'}/>
            <Text className='text-subText font-noto text-detail'>Sleep</Text>
        </View>
        <View style={{ transform: [{ translateX: 2 }]}} className='justify-center'>
          <Text className='text-heading3 text-subText font-noto'>33:33</Text>
        </View>
      </View>

      <View style={{ transform: [{ translateY: 6 }]}} className='items-center grow'>
        <View className='flex flex-row gap-1 items-center'>
          <DayIcon  width={12} height={12} color={'#fba742'}/>
            <Text className='text-subText font-noto text-detail'>Wake Up</Text>
        </View>
        <View style={{ transform: [{ translateX: 4 }]}} className='justify-center'>
          <Text className='text-heading3 text-subText font-noto'>33:33</Text>
        </View>
      </View>

      <View className='grow flex flex-row gap-1 items-center justify-end'>
        <PenIcon width={16} height={16} color={'#CFCFCF'}/>
        <Text style={{color:'#CFCFCF'}} className='text-body font'>Edit</Text>
      </View>
    </View>
  )
}

export default SleepDaySummary