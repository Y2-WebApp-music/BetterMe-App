import { View, Text, TouchableOpacity } from 'react-native'
import { AddIcon, DayIcon, NightIcon, PenIcon  } from '../../constants/icon'
import { useTheme } from '../../context/themeContext';
import EditSleepModal from '../modal/EditSleepModal';
import { useCallback, useEffect, useState } from 'react';
import { sleepCardDisplay } from '../../types/sleep';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { addDays, differenceInMinutes, format, subDays } from 'date-fns';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { useAuth } from '../../context/authContext';

type SleepTodayProp = {
  select_date?:string
}
const SleepToday = ({select_date}:SleepTodayProp) => {

  const { colors } = useTheme();
  const { user } = useAuth()

  const [editSleep, setEditSleep] = useState(false)
  const [sleepData, setSleepData] = useState<sleepCardDisplay>({
    sleep_id:'',
    total_time: 0,
    sleep_date: null,
    start_time: null,
    end_time: null,
    create_by: '',
  })

  const [sleepTime, setSleepTime] = useState({ hours: 0, minutes: 0 });

  const getByDate = async (date:string) => {
    console.warn('getByDate',`${SERVER_URL}/sleep/data?date=${date}&id=${user?._id}`);
    try {
      const response = await axios.get(`${SERVER_URL}/sleep/data?date=${date}&id=${user?._id}`);

      if ( response.data.message === "No sleep found") {
        setSleepData({sleep_id:'',total_time: 0, sleep_date: null, start_time: null, end_time: null, create_by: ''})
        setSleepTime({ hours: 0, minutes: 0 })
        return
      }
      const data = response.data[0]
      console.log('sleep data ',data);

      setSleepData({
        sleep_id:data._id,
        total_time: data.total_time,
        sleep_date: data.sleep_date,
        start_time: data.start_time,
        end_time: data.end_time,
        create_by: data.create_by
      })

      setSleepTime({
        hours: Math.floor(data.total_time / 60) || 0,
        minutes: data.total_time % 60 || 0,
      });
    } catch(error) {
      console.error('getByDate Error',error)
    }
  }

  const getStorage = async () => {
    try {
      const existingRecords = await AsyncStorage.getItem('sleepRecords');
      console.log('existingRecords ', existingRecords);
  
      if (existingRecords) {
        const parsedRecords = JSON.parse(existingRecords);

        console.log('parsedRecords ',parsedRecords);
        
  
        if (Array.isArray(parsedRecords) && parsedRecords.length > 0) {
          setSleepData((prev) => ({
            ...prev,
            sleep_id: parsedRecords[0]._id || '',
            total_time: parseInt(parsedRecords[0].total_time || '0', 10),
            sleep_date: parsedRecords[0].sleep_date || '',
            start_time: parsedRecords[0].start_time || '',
            end_time: parsedRecords[0].end_time || '',
            create_by: parsedRecords[0].create_by || '',
          }));

          setSleepTime({
            hours: Math.floor((parseInt(parsedRecords[0].total_time , 10)) / 60) || 0,
            minutes: (parseInt(parsedRecords[0].total_time , 10)) % 60 || 0,
          });
        }
      } else {
        const getDate = subDays(new Date(), 1)
        await getByDate(getDate.toDateString())
      }
    } catch (error) {
      console.error('Error fetching sleep records:', error);
    }
  };

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
      
      setSleepData((prev)=>({...prev, start_time: start_Time.toISOString()}))
    } else if (newTime < 0) {
      start_Time = subDays(startTime, 1);
      newTime = differenceInMinutes(endTime, start_Time) - 30;

      setSleepData((prev)=>({...prev, start_time: start_Time.toISOString()}))
    }

    const hour = Math.floor(newTime/60)
    const minute = newTime % 60

    setSleepData((prev) => ({...prev , totalTime : newTime}))
    setSleepTime({hours:hour, minutes:minute})

    try {
      const response = await axios.put(`${SERVER_URL}/sleep/update/${sleepData.sleep_id}`,{
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

  useFocusEffect(
    useCallback(() => {
      if (select_date){
        console.log('=SleepToday= have date', select_date);
        getByDate(select_date)
      } else {
        console.log('=SleepToday= getStorage');
        getStorage()
      }
    }, [select_date])
  );
  

  return (
    <View style={{paddingHorizontal:14, backgroundColor:colors.white, borderColor:colors.gray }} className='h-[5.5rem] w-full rounded-normal border  p-2 justify-center items-center flex-row gap-2'>

      <View style={{paddingLeft:6}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text style={{color:colors.subText}} className='text-heading3 font-noto '>Total time</Text>
        </View>
        <View className='flex-row gap-1 items-end'>
          <Text style={{color:colors.night}} className='text-title font-notoMedium'>{sleepTime.hours}</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text style={{color:colors.subText}}>h</Text>
          </View>
          <Text style={{color:colors.night}} className='text-title text-night font-notoMedium'>{sleepTime.minutes}</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text style={{color:colors.subText}}>m</Text>
          </View>
        </View>
      </View>

      {sleepData.start_time !== null && sleepData.start_time !== null ?(
        <>
        <View style={{justifyContent:'center'}} className='grow flex flex-row gap-1'>
        <View>
          <View style={{ transform: [{ translateY: 10 }] }} className='flex flex-row gap-1 items-center mb-4'>
            <NightIcon  width={12} height={12} color={colors.night}/>
              <Text style={{color:colors.subText}} className=' font-noto'>Sleep</Text>
          </View>
          <View style={{ transform: [{ translateX: 4 }] }} className='flex-row gap-1 items-end'>
            <Text style={{color: colors.subText}} className='text-heading3'>{sleepData.start_time? format(sleepData.start_time,'HH:mm') : `--:--`}</Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection:'column', justifyContent:'center', alignContent:'center'}} className='grow flex'>
        <View style={{ transform: [{ translateY: 10 }] }} className='flex flex-row gap-1 items-center mb-4'>
          <DayIcon  width={12} height={12} color={colors.yellow}/>
            <Text style={{color:colors.subText}} className=' font-noto'>Wake Up</Text>
        </View>
        <View style={{ transform: [{ translateX: -6 }], justifyContent:'center' }} className='flex-row gap-1'>
          <Text style={{color: colors.subText}} className='text-heading3'>{sleepData.end_time ? format(sleepData.end_time,'HH:mm') : `--:--`}</Text>
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

      <EditSleepModal
        date={sleepData.sleep_date ? new Date(sleepData.sleep_date) : new Date()}
        startTime={sleepData.start_time ? new Date(sleepData.start_time) : new Date()}
        setStartTime={(newStart) =>
          setSleepData((prev) => ({
            ...prev,
            start_time: newStart.toISOString(),
          }))
        }
        endTime={sleepData.end_time ? new Date(sleepData.end_time) : new Date()}
        setEndTime={(newEnd) =>
          setSleepData((prev) => ({
            ...prev,
            end_time: newEnd.toISOString(),
          }))
        }
        isOpen={editSleep}
        setIsOpen={setEditSleep}
        updateTime={updateTime}
      />

    </View>
  )
}


export default SleepToday