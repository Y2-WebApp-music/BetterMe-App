import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { AddIcon, DayIcon, NightIcon, PenIcon, RightArrowIcon } from '../../constants/icon'
import { addDays, differenceInMinutes, format, subDays } from 'date-fns'
import { useTheme } from '../../context/themeContext'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import EditSleepModal from '../modal/EditSleepModal'
import { sleepCard, sleepCardDisplay } from '../../types/sleep'
import { useFocusEffect } from 'expo-router'
import axios from 'axios'
import { SERVER_URL } from '@env'

const SleepDaySummary = ({sleep_id, total_time, sleep_date, start_time, end_time, create_by}:sleepCardDisplay) => {

  const { colors } = useTheme();
  const [editSleep, setEditSleep] = useState(false)

  const [sleepData, setSleepData] = useState({
    sleep_id:sleep_id,
    totalTime: total_time,
    sleep_date: sleep_date ? new Date(sleep_date) : null,
    start_time:start_time ? new Date(start_time) : null,
    end_time:end_time? new Date(end_time) : null,
    create_by: create_by
  })

  const [sleepTime, setSleepTime] = useState({ hours: 0, minutes: 0 });

  useFocusEffect(
    useCallback(() => {
      console.log('sleep Goal useCallback')

      if (total_time && sleep_date && start_time && end_time) {
        setSleepTime({
          hours: Math.floor(total_time / 60),
          minutes: total_time % 60,
        });
        setSleepData({
          sleep_id:sleep_id,
          totalTime: total_time,
          sleep_date:new Date(sleep_date),
          start_time:new Date(start_time),
          end_time:new Date(end_time),
          create_by: create_by
        })
      } else {
        setSleepTime({
          hours: 0,
          minutes: 0 ,
        });
        setSleepData({
          sleep_id:'',
          totalTime: 0,
          sleep_date: null,
          start_time: null,
          end_time: null,
          create_by: ''
        })
      }

    }, [sleep_date])
  );

  const handleEdit = () => {
    if (sleepData.sleep_date && sleepData.start_time && sleepData.end_time) {
      setEditSleep(true)
    } else {
      console.error('Failed to edit time')
    }
  }

  const updateTime = async (startTime:Date, endTime:Date) => {
    let newTime = differenceInMinutes(endTime, startTime) - 30
    let start_Time = startTime

    if (newTime >= 1440) {
      start_Time = addDays(startTime, 1)
      newTime = differenceInMinutes(endTime, start_Time) - 30
      
      setSleepData((prev)=>({...prev, start_time: start_Time}))
    } else if (newTime < 0) {
      start_Time = subDays(startTime, 1);
      newTime = differenceInMinutes(endTime, start_Time) - 30;

      setSleepData((prev)=>({...prev, start_time: start_Time}))
    }

    const hour = Math.floor(newTime/60)
    const minute = newTime % 60

    setSleepData((prev) => ({...prev , totalTime : newTime}))
    setSleepTime({hours:hour, minutes:minute})

    try {
      const response = await axios.put(`${SERVER_URL}/sleep/update/${sleep_id}`,{
        sleep_date: sleepData.sleep_date,
        start_time: start_Time,
        end_time: endTime,
        total_time: newTime,
        create_by: sleepData.create_by
      });
  
      const data = response.data
  
      if (data.message === "Update sleep success") {
        console.log('Update sleep success');
        return data.sleep
      }
  
    } catch(error) {
      console.error('update failed',error)
    }
  }

  return (
    <View style={{paddingVertical:10, backgroundColor:colors.white, borderColor:colors.gray}} className='px-4 border rounded-normal flex-row items-center'>
      <View className='grow'>
        <Text style={{color:colors.subText}} className=' font-noto'>{sleep_date ? format(sleep_date, "eee '|' dd MMM yyyy") : `--:--`}</Text>
        <View style={{ transform: [{ translateY: 0 }]}} className='flex-row gap-1 items-end'>
          <Text style={{color:colors.subText}} className='text-detail font-noto'>Total</Text>
          <View style={{ transform: [{ translateY: 4 }]}}>
            <Text style={{color:colors.text}} className='text-heading font-noto'>{sleepTime.hours}</Text>
          </View>
          <View style={{ transform: [{ translateY: 0 }]}}>
            <Text style={{color:colors.subText}} className='text-body font-noto '>h</Text>
          </View>
          <View style={{ transform: [{ translateY: 4 }]}}>
            <Text style={{color:colors.text}} className='text-heading font-noto'>{sleepTime.minutes}</Text>
          </View>
          <View style={{ transform: [{ translateY: 0 }]}}>
            <Text style={{color:colors.subText}} className='text-body font-noto'>m</Text>
          </View>
        </View>
      </View>

      {sleepData.start_time !== null && sleepData.start_time !== null ?(
        <>
        <View style={{ transform: [{ translateY: 6 }]}} className='items-center grow'>
          <View className='flex flex-row gap-1 items-center'>
            <NightIcon  width={12} height={12} color={'#454ab6'}/>
              <Text style={{color:colors.subText}} className=' font-noto text-detail'>Sleep</Text>
          </View>
          <View style={{ transform: [{ translateX: 2 }]}} className='justify-center'>
            <Text style={{color:colors.subText}} className='text-heading3  font-noto'>{sleepData.start_time? format(sleepData.start_time,'HH:mm') : `--:--`}</Text>
          </View>
        </View>

        <View style={{ transform: [{ translateY: 6 }]}} className='items-center grow'>
          <View className='flex flex-row gap-1 items-center'>
            <DayIcon  width={12} height={12} color={'#fba742'}/>
              <Text style={{color:colors.subText}} className=' font-noto text-detail'>Wake Up</Text>
          </View>
          <View style={{ transform: [{ translateX: 4 }]}} className='justify-center'>
            <Text style={{color:colors.subText}} className='text-heading3  font-noto'>{sleepData.end_time ? format(sleepData.end_time,'HH:mm') : `--:--`}</Text>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={handleEdit} style={{display:'flex', flexDirection:'row', gap:2, paddingLeft:4}} className='grow items-center justify-end'>
          <View style={{transform:[{translateY:2}]}}>
            <PenIcon width={16} height={16} color={colors.darkGray}/>
          </View>
          <Text style={{color:colors.darkGray}} className='text-body font'>Edit</Text>
        </TouchableWithoutFeedback>
        </>
      ):(
        <View>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{backgroundColor:colors.darkGray}} className='p-1 px-4 rounded-full flex-row justify-center items-center gap-2'
          >
            <Text style={{color:'#fff'}} className='font-noto text-body'> Add Time</Text>
            <AddIcon width={26} height={26} color={'#fff'}/>
          </TouchableOpacity>
        </View>
      )}

      {sleepData.sleep_date && sleepData.start_time && sleepData.end_time &&
        <EditSleepModal
          date={sleepData.sleep_date}
          startTime={sleepData.start_time}
          setStartTime={(newStart) => setSleepData((prev) => ({ ...prev, start_time: newStart }))}
          endTime={sleepData.end_time}
          setEndTime={(newEnd) => setSleepData((prev) => ({ ...prev, end_time: newEnd }))}
          isOpen={editSleep}
          setIsOpen={setEditSleep}
          updateTime={updateTime}
        />
      }
    </View>
  )
}

export default SleepDaySummary