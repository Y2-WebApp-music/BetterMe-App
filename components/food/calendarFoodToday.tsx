import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { PenIcon, RightArrowIcon  } from '../../constants/icon'
import { MealSummaryCard } from '../../types/food'
import { useAuth } from '../../context/authContext'
import { router } from 'expo-router'
import { useTheme } from '../../context/themeContext'


export type Meal = {
  total_calorie:number
  total_protein :number
  total_carbs:number
  total_fat:number
}

const CalendarFoodToday = ({total_calorie, total_protein, total_carbs, total_fat}:MealSummaryCard) => {

  const { colors } = useTheme();
  const { user } = useAuth()

  return (
    <View style={{paddingHorizontal:14, backgroundColor:colors.white, borderColor:colors.gray }}className='h-28 w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>

      <View style={{paddingLeft:6}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text style={{color:colors.subText}} className='text-heading3 font-noto'>Total Calories</Text>
        </View>
        <View className='flex-row gap-1 items-end '>
          <Text style={{color:colors.green}} className='text-title font-notoMedium'>{total_calorie || 0}</Text>
          {/* <View style={{ transform: [{ translateY: -6 }] }}>
            <Text className='text-heading2 text-subText font-noto'>cal</Text>
          </View> */}
          <View style={{ transform: [{ translateY: -7 }], marginLeft:2 }}>
            <Text style={{color:colors.subText}} className=' font-notoLight text-body'>of {Math.floor(user?.calorie_need || 0)} cal</Text>
          </View>

        </View>
        <View style={{ transform: [{ translateY: -10 }], flexDirection:'row', gap:12, marginTop:2 }}>
          <Text style={{color:colors.subText}} className='text-detail font-notoLight'>Protein : {total_protein || 0}g</Text>
          <Text style={{color:colors.subText}} className='text-detail font-notoLight'>Carbs : {total_carbs || 0}g</Text>
          <Text style={{color:colors.subText}} className='text-detail font-notoLight'>Fat : {total_fat || 0}g</Text>
        </View>
      </View>

    </View>
  )
}


export default CalendarFoodToday