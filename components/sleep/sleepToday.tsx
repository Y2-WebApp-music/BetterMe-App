import { View, Text, TouchableOpacity } from 'react-native'
import { DayIcon, NightIcon, PenIcon  } from '../../constants/icon'
import { useTheme } from '../../context/themeContext';
import EditSleepModal from '../modal/EditSleepModal';
import { useEffect, useState } from 'react';

const SleepToday = () => {

  const { colors } = useTheme();
  const [editSleep, setEditSleep] = useState(false)
  const [sleepData, setSleepData] = useState({
    totalTime: 512,
    date: (() => {
      const now = new Date();
      now.setDate(now.getDate() - 1);
      return now;
    })(),
    start_time: (() => {
      const now = new Date();
      now.setDate(now.getDate() - 1);
      now.setHours(22, 0, 0, 0);
      return now;
    })(),
    end_time: (() => {
      const now = new Date();
      now.setDate(now.getDate());
      now.setHours(7, 0, 0, 0);
      return now;
    })(),
  })

  useEffect(()=>{
    console.log('sleepData start_time',sleepData.start_time.toLocaleString());
    console.log('sleepData end_time',sleepData.end_time.toLocaleString());
  },[sleepData])
  

  return (
    <View style={{paddingHorizontal:14, backgroundColor:colors.white, borderColor:colors.gray }} className='h-[5.5rem] w-full rounded-normal border  p-2 justify-center items-center flex-row gap-2'>

      <View style={{paddingLeft:6}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text style={{color:colors.subText}} className='text-heading3 font-noto '>Total time</Text>
        </View>
        <View className='flex-row gap-1 items-end'>
          <Text style={{color:colors.night}} className='text-title font-notoMedium'>8</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text style={{color:colors.subText}}>h</Text>
          </View>
          <Text style={{color:colors.night}} className='text-title text-night font-notoMedium'>33</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text style={{color:colors.subText}}>m</Text>
          </View>
        </View>
      </View>

      <View style={{justifyContent:'center'}} className='grow flex flex-row gap-1'>
        <View>
          <View style={{ transform: [{ translateY: 10 }] }} className='flex flex-row gap-1 items-center mb-4'>
            <NightIcon  width={12} height={12} color={colors.night}/>
              <Text style={{color:colors.subText}} className=' font-noto'>Sleep</Text>
          </View>
          <View style={{ transform: [{ translateX: 4 }] }} className='flex-row gap-1 items-end'>
            <Text style={{color: colors.subText}} className='text-heading3 '>33:32</Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection:'column', justifyContent:'center', alignContent:'center'}} className='grow flex'>
        <View style={{ transform: [{ translateY: 10 }] }} className='flex flex-row gap-1 items-center mb-4'>
          <DayIcon  width={12} height={12} color={colors.yellow}/>
            <Text style={{color:colors.subText}} className=' font-noto'>Wake Up</Text>
        </View>
        <View style={{ transform: [{ translateX: -6 }], justifyContent:'center' }} className='flex-row gap-1'>
          <Text style={{color: colors.subText}} className='text-heading3'>33:33</Text>
        </View>
      </View>

      <TouchableOpacity onPress={()=>{setEditSleep(true)}} className='flex flex-row gap-1 items-center'>
        <PenIcon width={20} height={20} color={colors.darkGray}/>
        <Text style={{color:colors.darkGray}} className='text-body font'>Edit</Text>
      </TouchableOpacity>

      <EditSleepModal
          date={sleepData.date}
          startTime={sleepData.start_time}
          setStartTime={(newStart) => setSleepData((prev) => ({ ...prev, start_time: newStart }))}
          endTime={sleepData.end_time}
          setEndTime={(newEnd) => setSleepData((prev) => ({ ...prev, end_time: newEnd }))}
          isOpen={editSleep}
          setIsOpen={setEditSleep}
        />

    </View>
  )
}


export default SleepToday