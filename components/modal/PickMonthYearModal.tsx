import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { Picker } from '@react-native-picker/picker'
import { BackwardIcon, ForwardIcon } from '../../constants/icon'
import { useTheme } from '../../context/themeContext'

type PickMonthYearProp = {
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  currentMonth:string
  setCurrentMonthYear: (monthYear: string) => void;
}

const PickMonthYearModal = ({selectedDate, setSelectedDate, currentMonth, setCurrentMonthYear, isOpen, setIsOpen}:PickMonthYearProp) => {

  const { colors } = useTheme();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const getFirstSunday = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const offset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Days to reach the next Sunday
    return new Date(year, month, 1 + offset);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const firstSunday = getFirstSunday(selectedDate.getFullYear(), monthIndex);
    console.log('handleMonthSelect selectedDate',selectedDate);
    console.log('firstSunday',firstSunday);
    
    setSelectedDate(firstSunday);
    setCurrentMonthYear(`${months[monthIndex]} ${firstSunday.getFullYear()}`);
    setIsOpen(false)
  };

  useEffect(()=>{
    console.log('Date in Modal :',selectedDate);
    
  },[])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View style={{backgroundColor:colors.white}} className= 'w-full  p-4 rounded-normal'>
        <View className='flex-row'>
          <View className='grow'>
            <Text style={{color:colors.text}} className='font-notoMedium text-heading'>{currentMonth.split(' ')[1]}</Text>
          </View>
          <View className='flex-row gap-3'>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1)
                )
              }
            >
              <BackwardIcon width={34} height={34} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), 1)
                )
              }
            >
              <ForwardIcon width={34} height={34} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{display:'flex', flexDirection:'row', flexWrap:'wrap', gap:6}} className='mt-3'>
          {months.map((text,i)=>(
            <TouchableOpacity
              key={i}
              style={{
                width: '32%',
                backgroundColor:currentMonth.split(' ')[0] === months[i]? colors.primary:colors.white
              }}
              className='rounded-normal p-2'
              onPress={() => handleMonthSelect(i)}
            >
              <Text style={{color:currentMonth.split(' ')[0] === months[i]? '#fff':colors.subText}} className={`font-notoMedium text-body  text-center`}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )
}

export default PickMonthYearModal