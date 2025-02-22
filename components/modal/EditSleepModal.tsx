import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import Modal from './Modal'
import { useTheme } from '../../context/themeContext'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { useColorScheme } from 'react-native'
import { format } from 'date-fns'
import { DayIcon, NightIcon } from '../../constants/icon'


type EditSleepModalProp = {
  startDate:Date
  setStartDate:(value:Date) => void
  endDate:Date
  setEndDate:(value:Date) => void
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
}

const EditSleepModal = ({startDate, setStartDate, endDate, setEndDate, isOpen, setIsOpen}:EditSleepModalProp) => {

  const systemTheme = useColorScheme();
  const { theme, colors } = useTheme();

  const toggleDatePicker = () => {
    setIsOpen(!isOpen)
  }

  const handleDateChange = (type: "start" | "end") => (
    event: any,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      if (Platform.OS === "android") {
        toggleDatePicker();
      }
      if (type === "start") {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View style={{backgroundColor:colors.white}} className= 'w-full h-fit py-2 px-4 rounded-normal'>
        <View className='flex-row'>
          <View className='grow items-start justify-center'>
            <Text style={{color:colors.subText}} className='text-body mt-2'>Edit Sleep time</Text>
            <Text style={{color:colors.text}} className='text-heading mt-2'>{format(startDate,'dd MMM YYY')}</Text>
          </View>
          <View className='items-start justify-center'>
            <Text style={{color:colors.subText}} className='text-body mt-2'>Total Time</Text>
            <View className='flex-row gap-1 items-end'>
              <Text style={{color:colors.night}} className='text-subTitle font-notoMedium'>7</Text>
              <Text style={{color:colors.subText, transform:[{translateY:-6}]}} className='text-body font-noto'>h</Text>
              <Text style={{color:colors.night}} className='text-subTitle font-notoMedium'>23</Text>
              <Text style={{color:colors.subText, transform:[{translateY:-6}]}} className='text-body font-noto'>h</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2 mt-4 justify-center">
          {[
            { label: "Sleep", date: startDate, onChange: handleDateChange("start"), icon: 'NightIcon' },
            { label: "Wake up", date: endDate, onChange: handleDateChange("end"), icon: 'DayIcon' },
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
        </View>

        <View className='w-full items-end justify-end flex-row gap-3 mt-4'>
          <TouchableOpacity onPress={()=>{setIsOpen(false)}} style={{backgroundColor:colors.nonFocus}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
            <Text style={{color:colors.white}} className='w-fit text-heading2 font-notoMedium'>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{setIsOpen(false)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default EditSleepModal