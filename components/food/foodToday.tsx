import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { PenIcon, RightArrowIcon  } from '../../constants/icon'


export type Meal = {
  total_calorie:number
  total_protein :number
  total_carbs:number
  total_fat:number
}

const FoodToday = () => {

  return (
    <TouchableOpacity activeOpacity={0.7} style={{paddingHorizontal:14, backgroundColor:'white' }} className='h-28 w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>

      <View style={{paddingLeft:6}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text className='text-heading3 font-noto text-subText'>Total Calories</Text>
        </View>
        <View className='flex-row gap-1 items-end '>
          <Text style={{color:'#0dc47c'}} className='text-title font-notoMedium'>2365</Text>
          {/* <View style={{ transform: [{ translateY: -6 }] }}>
            <Text className='text-heading2 text-subText font-noto'>cal</Text>
          </View> */}
          <View style={{ transform: [{ translateY: -7 }], marginLeft:2 }}>
            <Text className='text-subText font-notoLight text-body'>of 2500 cal</Text>
          </View>

        </View>
        <View style={{ transform: [{ translateY: -10 }], flexDirection:'row', gap:12, marginTop:2 }}>
          <Text style={{color:'gray'}} className='text-detail font-notoLight'>Protein : 12g</Text>
          <Text style={{color:'gray'}} className='text-detail font-notoLight'>Carbs : 24g</Text>
          <Text style={{color:'gray'}} className='text-detail font-notoLight'>Fat : 9g</Text>
        </View>
      </View>

      <View style={{paddingRight:0}} className='flex flex-row gap-1 items-center'>
        {/* <PenIcon width={20} height={20} color={'#626262'}/> */}
        <Text style={{color:'#CFCFCF'}} className='text-body font-noto text-DarkGray'>See more</Text>
        <RightArrowIcon width={20} height={20} color={'#CFCFCF'}/>
      </View>

    </TouchableOpacity>
  )
}


export default FoodToday