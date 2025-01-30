import { View, Text, Animated, TouchableWithoutFeedback, Easing, TouchableOpacity } from 'react-native'
import { FoodIcon, BackwardIcon, ForwardIcon  } from '../../constants/icon'
import { StyleSheet } from 'react-native'
import { BarChart } from "react-native-gifted-charts";
import WeekFoodChart from './weekFoodChart';

const FoodSummary = () => {

  return (
    <View style={{paddingHorizontal:15, paddingVertical:12, backgroundColor:'white' }}  className=' w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>
      <View className='grow'>
        <View className='flex flex-row gap-2 items-center justify-between ' >
          <View className='flex flex-row gap-1 items-center'>
            <FoodIcon width={15} height={15} color={'#0dc47c'}/>
            <Text className='text-body font-noto '>calorie in week</Text>
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
          <View style={{marginLeft:4}}>
            <Text className='font-noto text-subText'>23-30 Aug 2024</Text>
            <View style={{ transform: [{ translateY: -6 }] }} className='flex-row gap-1 items-end'>
              <Text style={{color:'#0dc47c'}} className='text-title font-notoMedium'>2365</Text>
              <View style={{ transform: [{ translateY: -10 }] }}>
                <Text className='text-subText'>cal</Text>
              </View>
            </View>
          </View>
          <View>
            <WeekFoodChart/>
          </View>
        </View>
    </View>


    </View>
  )
}


export default FoodSummary