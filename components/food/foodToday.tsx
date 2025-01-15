import { View, Text, TouchableWithoutFeedback } from 'react-native'
import { PenIcon  } from '../../constants/icon'

const FoodToday = () => {

  return (
    <View style={{paddingHorizontal:20, backgroundColor:'white' }} className='h-28 w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>

      <View style={{paddingLeft:10}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text className='text-heading3 font-noto'>Total Calories</Text>
        </View>
        <View className='flex-row gap-1 items-end '>
          <Text style={{color:'#0dc47c'}} className='text-title font-notoMedium'>2365</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text className='text-heading3'>cal</Text>
          </View>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text className='text-subText'>need 2500 cal</Text>
          </View>

          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text>Protein : 12g</Text>
            <Text>Carb : 24g</Text>
            <Text>Fat : 9g</Text>
        </View>
        </View>
        
      </View>



      <View className='flex flex-row gap-1 items-center'>
        <PenIcon width={20} height={20} color={'#CFCFCF'}/>
        <Text className='text-body'>Edit</Text>
      </View>

      

    </View>
  )
}


export default FoodToday