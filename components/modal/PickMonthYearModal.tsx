import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Modal from './Modal'
import { Picker } from '@react-native-picker/picker'
import { BackwardIcon, ForwardIcon } from '../../constants/icon'

type PickMonthYearProp = {
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  currentMonth:string
  setCurrentMonthYear: (monthYear: string) => void;
}

const PickMonthYearModal = ({selectedDate, setSelectedDate, currentMonth, setCurrentMonthYear, isOpen, setIsOpen}:PickMonthYearProp) => {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const getFirstSunday = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const offset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Days to reach the next Sunday
    return new Date(year, month, 1 + offset);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const firstSunday = getFirstSunday(selectedDate.getFullYear(), monthIndex);
    setSelectedDate(firstSunday);
    setCurrentMonthYear(`${months[monthIndex]} ${firstSunday.getFullYear()}`);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View className= 'w-full bg-white p-4 rounded-normal'>
        <View className='flex-row'>
          <View className='grow'>
            <Text className='font-notoMedium text-heading'>{currentMonth.split(' ')[1]}</Text>
          </View>
          <View className='flex-row gap-3'>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1)
                )
              }
            >
              <BackwardIcon width={34} height={34} color={'#1c60de'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear() + 1,
                    selectedDate.getMonth(),1)
                )
              }
            >
              <ForwardIcon width={34} height={34} color={'#1c60de'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{display:'flex', flexDirection:'row', flexWrap:'wrap', gap:6}} className='mt-3'>
          {months.map((text,i)=>(
            <TouchableOpacity
              key={i}
              style={{
                width: '32%',
                backgroundColor:currentMonth.split(' ')[0] === months[i]? '#1c60de':'#fff'
              }}
              className='rounded-normal p-2'
              onPress={() => handleMonthSelect(i)}
            >
              <Text className={`font-notoMedium text-body ${currentMonth.split(' ')[0] === months[i]? 'text-white':'text-subText'}  text-center`}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )
}

export default PickMonthYearModal