import { View, Text } from 'react-native'
import { DayIcon, NightIcon, PenIcon  } from '../../constants/icon'

const SleepToday = () => {

  return (
    <View style={{paddingHorizontal:14, backgroundColor:'white' }} className='h-[5.5rem] w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>

      <View style={{paddingLeft:6}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text className='text-heading3 font-noto text-subText'>Total time</Text>
        </View>
        <View className='flex-row gap-1 items-end'>
          <Text style={{color:'#454ab6'}} className='text-title font-notoMedium'>8</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text className='text-subText'>h</Text>
          </View>
          <Text style={{color:'#454ab6'}} className='text-title text-night font-notoMedium'>33</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text className='text-subText'>m</Text>
          </View>
        </View>
      </View>

      <View style={{justifyContent:'center'}} className='grow flex flex-row gap-1'>
        <View>
          <View style={{ transform: [{ translateY: 10 }] }} className='flex flex-row gap-1 items-center mb-4'>
            <NightIcon  width={12} height={12} color={'#454AB6'}/>
              <Text className='text-subText font-noto'>Sleep</Text>
          </View>
          <View style={{ transform: [{ translateX: 4 }] }} className='flex-row gap-1 items-end'>
            <Text style={{color: '#626262'}} className='text-heading3 text-subText'>33:32</Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection:'column', justifyContent:'center', alignContent:'center'}} className='grow flex'>
        <View style={{ transform: [{ translateY: 10 }] }} className='flex flex-row gap-1 items-center mb-4'>
          <DayIcon  width={12} height={12} color={'#fba742'}/>
            <Text className='text-subText font-noto'>Wake Up</Text>
        </View>
        <View style={{ transform: [{ translateX: -6 }], justifyContent:'center' }} className='flex-row gap-1'>
          <Text style={{color: '#626262'}} className='text-heading3'>33:33</Text>
        </View>
      </View>

      <View className='flex flex-row gap-1 items-center'>
        <PenIcon width={20} height={20} color={'#626262'}/>
        <Text style={{color:'#626262'}} className='text-body font'>Edit</Text>
      </View>

      

    </View>
  )
}


export default SleepToday