import { View, Text, Animated, TouchableWithoutFeedback, Easing, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { NightIcon, BackwardIcon, ForwardIcon  } from '../../constants/icon'
import { StyleSheet } from 'react-native'
import { BarChart } from "react-native-gifted-charts";

const SleepSummary = () => {

  const barData = [
    {value: 6.5, label: 'Mon',labelTextStyle: {color: '#626262'},},
    {value: 4, label: 'Tru',labelTextStyle: {color: '#626262'},},
    {value: 5, label: 'Wed',labelTextStyle: {color: '#626262'},},
    {value: 7.8, label: 'Thu',labelTextStyle: {color: '#626262'},},
    {value: 7, label: 'Fri',labelTextStyle: {color: '#626262'},},
    {value: 5.6, label: 'Sat',labelTextStyle: {color: '#626262'},},
    {value: 8, label: 'Sun',labelTextStyle: {color: '#626262'},},
];

  return (
    <View style={{paddingHorizontal:15, paddingVertical:12, backgroundColor:'white' }} className=' w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>
      <View className='grow'>
        <View className=' relative flex flex-row gap-2 items-center justify-between ' >
          <View className='flex flex-row gap-1 items-center'>
            <NightIcon width={15} height={15} color={'#454AB6'}/>
            <Text className='text-heading3 font-noto '>Sleep time</Text>
          </View>
          <View style={{ transform: [{ translateY: 2 },{ translateX: 6 }]}} className='right-0 absolute flex flex-row gap-4 items-center'>
            <TouchableOpacity>
              <BackwardIcon width={34} height={34} color={'#CFCFCF'}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <ForwardIcon width={34} height={34} color={'#CFCFCF'}/>
            </TouchableOpacity>
          </View>
        </View>
        <View className='mt-2'>
        <View style={{marginLeft:6}}>
          <Text className='font-noto text-subText'>23-30 Aug 2024</Text>
          <View style={{ transform: [{ translateY: -6 }] }} className='flex-row gap-1 items-end'>
            <Text style={{color:'#454ab6'}} className='text-title font-notoMedium'>46</Text>
            <View style={{ transform: [{ translateY: -10 }] }}>
              <Text className='text-subText'>h</Text>
            </View>
            <Text style={{color:'#454ab6'}} className='text-title text-night font-notoMedium'>34</Text>
            <View style={{ transform: [{ translateY: -10 }] }}>
              <Text className='text-subText'>m</Text>
            </View>
          </View>
        </View>
          <View style={{ overflow:'hidden'}}>
            <BarChart
                barWidth={32}
                noOfSections={3}
                barBorderRadius={6}
                barBorderBottomLeftRadius={0}
                barBorderBottomRightRadius={0}
                spacing={10}
                width={300}
                height={150}
                frontColor="#454AB6"
                data={barData}
                yAxisThickness={0}
                yAxisLabelSuffix='h'
                xAxisThickness={1}
                xAxisColor={'#CFCFCF'}
                isAnimated
                disablePress
            />
          </View>
        </View>
    </View>


    </View>
  )
}


export default SleepSummary