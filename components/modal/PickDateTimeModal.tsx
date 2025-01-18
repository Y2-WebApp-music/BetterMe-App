import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from './Modal'
import RNDateTimePicker from '@react-native-community/datetimepicker'

type PickDateTimeModalProp = {
  value:Date
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  setDate:(value:Date) => void
  maximumDate:boolean
}

const PickDateTimeModal = ({value, isOpen, setIsOpen, setDate, maximumDate}:PickDateTimeModalProp) => {

  const lockDate = maximumDate? new Date() : new Date(new Date().setDate(new Date().getDate() + 10000));

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View className= 'w-full bg-white h-fit p-4 rounded-normal'>
        <View className='w-full items-center justify-center'>
            <Text className='text-heading2 mt-2'>Select Date</Text>
        </View>
        <RNDateTimePicker
          display="spinner"
          mode="datetime"
          value={value}
          maximumDate={lockDate}
          onChange={handleDateChange}
          style={{}}
          locale="en-Gn"
          themeVariant='light'
        />
        <View className='w-full items-end justify-end'>
          <TouchableOpacity onPress={()=>{setIsOpen(false)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default PickDateTimeModal