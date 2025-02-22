import { View, Text, Animated, TouchableWithoutFeedback, Easing, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { NightIcon, BackwardIcon, ForwardIcon  } from '../../constants/icon'
import WeekSleepChart from './weekSleepChart'
import { useTheme } from '../../context/themeContext'

const SleepSummary = () => {

  const { colors } = useTheme();
  return (
    <View style={{paddingHorizontal:15, paddingVertical:12, backgroundColor:colors.white, borderColor:colors.gray }} className=' w-full rounded-normal border p-2 justify-center items-center flex-row gap-2'>
      <View className='grow'>
        <View className=' relative flex flex-row gap-2 items-center justify-between ' >
          <View className='flex flex-row gap-1 items-center'>
            <NightIcon width={15} height={15} color={colors.night}/>
            <Text style={{color:colors.text}} className='text-heading3 font-noto '>Sleep time</Text>
          </View>
          <View style={{ transform: [{ translateY: 2 },{ translateX: 6 }]}} className='right-0 absolute flex flex-row gap-4 items-center'>
            <TouchableOpacity>
              <BackwardIcon width={34} height={34} color={colors.darkGray}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <ForwardIcon width={34} height={34} color={colors.darkGray}/>
            </TouchableOpacity>
          </View>
        </View>
        <View className='mt-2'>
        <View style={{marginLeft:6}}>
          <Text style={{color:colors.subText}} className='font-noto'>23-30 Aug 2024</Text>
          <View style={{ transform: [{ translateY: -6 }] }} className='flex-row gap-1 items-end'>
            <Text style={{color:colors.night}} className='text-title font-notoMedium'>46</Text>
            <View style={{ transform: [{ translateY: -10 }] }}>
              <Text style={{color:colors.subText}} >h</Text>
            </View>
            <Text style={{color:colors.night}} className='text-title font-notoMedium'>34</Text>
            <View style={{ transform: [{ translateY: -10 }] }}>
              <Text style={{color:colors.subText}} >m</Text>
            </View>
          </View>
        </View>
          <WeekSleepChart graph={[4,5,3.4,5.6,6.7,0,3]}/>
        </View>
    </View>


    </View>
  )
}


export default SleepSummary