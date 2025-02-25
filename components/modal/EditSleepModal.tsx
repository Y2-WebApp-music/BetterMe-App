import { format } from 'date-fns'
import React, { useEffect } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { isSharedValue, useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { ReText } from 'react-native-redash'
import { useTheme } from '../../context/themeContext'
import CircularSlider from '../sleep/CircularSlider/CircularSlider'
import {
  PADDING,
  PI,
  SIZE,
  TAU,
  absoluteDuration,
  formatDuration2,
  formatDurationHour,
  formatDurationMinute,
  preFormatDuration,
  radToMinutes,
} from "../sleep/CircularSlider/Constants"
import Label from '../sleep/CircularSlider/Label'
import Modal from './Modal'

type EditSleepModalProp = {
  date:Date
  startTime:Date
  setStartTime:(value:Date) => void
  endTime:Date
  setEndTime:(value:Date) => void
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
}

const EditSleepModal = ({date, startTime, setStartTime, endTime, setEndTime, isOpen, setIsOpen}:EditSleepModalProp) => {

  const { colors } = useTheme();

  const timeToAngle = (time:Date) => {
    const minutes = time.getMinutes() + time.getHours() * 60;
    const normalized = minutes / (24 * 60) ;
    return (-(normalized * 2 * Math.PI) + Math.PI/2);
  };
  
  const startAngle = timeToAngle(startTime);
  const endAngle = timeToAngle(endTime);

  const start = useSharedValue(startAngle)
  const end = useSharedValue(endAngle)

  const angleToTime = (angle: number, baseDate: Date) => {

    const minute = Math.floor(((angle - PI / 2 + TAU) % TAU) * (24 * 60) / TAU)
    
    const { hours, minutes } = preFormatDuration(minute)
    // console.log(preFormatDuration(minute));
    
    const newTime = new Date(baseDate);
    newTime.setHours(hours, minutes, 0, 0);
  
    return newTime;
  };
  
  const handleConfirmPress = () => {
    const newStartTime = angleToTime(start.value, startTime);
    const newEndTime = angleToTime(end.value, endTime);
  
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  
    setIsOpen(false);
  };

  const durationHour = useDerivedValue(() => {
    const d = absoluteDuration(start.value, end.value);
    return formatDurationHour(radToMinutes(d)+ 360 );
  });
  const durationMinute = useDerivedValue(() => {
    const d = absoluteDuration(start.value, end.value);
    return formatDurationMinute(radToMinutes(d)+ 360 );
  });

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View style={{backgroundColor:colors.white}} className= 'w-full h-fit py-2 px-4 rounded-normal'>
        <View className='flex-row'>
          <View className='grow items-start justify-center'>
            <Text style={{color:colors.subText}} className='text-body mt-2'>Edit Sleep time</Text>
            <Text style={{color:colors.text}} className='text-heading mt-2'>{format(date,'dd MMM yyy')}</Text>
          </View>

          <View className='items-start justify-center'>
            <Text style={{color:colors.subText}} className='text-body mt-2'>Total Time</Text>
            <View className='flex-row gap-1 items-end'>
              <ReText style={{color:colors.night, fontSize:32, fontWeight:600}} text={durationHour} />
              <View style={{transform:[{translateY:0}]}}>
                <Text style={{color:colors.subText}} className='text-body font-noto'>h</Text>
              </View>
              <ReText style={{color:colors.night, fontSize:32, fontWeight:600}} text={durationMinute} />
              <View style={{transform:[{translateY:0}]}}>
                <Text style={{color:colors.subText}} className='text-body font-noto'>m</Text>
              </View>
            </View>
          </View>

        </View>

        {/* <View className="flex-row gap-2 mt-4 justify-center">
          {[
            { label: "Sleep", date: startTime, onChange: handleDateChange("start"), icon: 'NightIcon' },
            { label: "Wake up", date: endTime, onChange: handleDateChange("end"), icon: 'DayIcon' },
          ].map(({ label, date, onChange, icon }, index) => (
            <View style={{width:'40%'}} key={index} className="items-start justify-center">
              <View className='flex-row gap-1 items-end justify-center my-2'>
                {icon === "NightIcon" ? (
                  <NightIcon width={18} height={18} color={colors.night}/>
                ):(
                  <DayIcon width={18} height={18} color={colors.yellow}/>
                )}
                <Text style={{ color:colors.subText}} className="text-body">
                  {label}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <RNDateTimePicker
                  display='inline'
                  mode="time"
                  value={date}
                  onChange={onChange}
                  locale="en-US"
                  themeVariant={
                    theme === "dark" || (theme === "system" && systemTheme === "dark")
                      ? "dark"
                      : "light"
                  }
                />
              </View>
            </View>
          ))}
        </View> */}

        <View style={{ height:SIZE+6, width:SIZE+6, display:'flex', justifyContent:'center', alignItems:'center'}}>
          <GestureHandlerRootView style={{flex:1}}>
            <CircularSlider start={start} end={end}/>
          </GestureHandlerRootView>
        </View>

        <View style={styles.values}>
          <Label theta={start} label="BEDTIME" icon="moon" iconColor="night"/>
          <Label theta={end} label="WAKE UP" icon="sunny" iconColor="yellow"/>
        </View>

        <View className='w-full items-end justify-center flex-row gap-3 mt-4'>
          <TouchableOpacity onPress={handleConfirmPress} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2B2D",
    borderRadius: 16,
    padding: PADDING,
  },
  values: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  duration: {
    fontFamily: "SFProRounded-Medium",
    fontSize: 26,
    textAlign: "center",
    color: "red",
  },
});

export default EditSleepModal