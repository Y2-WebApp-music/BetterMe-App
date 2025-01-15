import { View, Text, Animated, TouchableWithoutFeedback, Easing, TouchableOpacity } from 'react-native'
import { FoodIcon, BackwardIcon, ForwardIcon  } from '../../constants/icon'
import { StyleSheet } from 'react-native'

const FoodSummary = () => {

  return (
    <View style={{paddingHorizontal:15, backgroundColor:'white' }} className=' w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>
      <View className='grow'>
        <View className='flex flex-row gap-2 items-center justify-between ' >
          <View className='flex flex-row gap-1 items-center'>
          <FoodIcon width={15} height={15} color={'#0dc47c'}/>
          <Text className='text-body font-noto '>calorie in week</Text>
          </View>
          <View className='flex flex-row gap-4 items-center'>
            <TouchableOpacity>
              <BackwardIcon width={30} height={30} color={'#CFCFCF'}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <ForwardIcon width={30} height={30} color={'#CFCFCF'}/>
            </TouchableOpacity>
            </View>
        </View>
        <View className='mt-3'>
          <Text className='font-noto text-subText'>23-30 Aug 2024</Text>
          <View className='flex-row gap-1 items-end'>
            <Text style={{color:'#0dc47c'}} className='text-title font-notoMedium'>2365</Text>
            <View style={{ transform: [{ translateY: -10 }] }}>
              <Text className='text-subText'>cal</Text>
              </View>
          </View>
          <View> 
            <Text>Graph here</Text>
            </View>
        </View>
    </View>


    </View>
  )
}


export default FoodSummary