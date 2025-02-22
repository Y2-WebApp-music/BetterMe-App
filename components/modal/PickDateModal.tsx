import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import Modal from './Modal'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { useTheme } from '../../context/themeContext'
import { useColorScheme } from 'react-native'

type PickDateModalProp = {
  value:Date
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  setDate:(value:Date) => void
  maximumDate:boolean
  minimumDate:boolean
}

const PickDateModal = ({value, isOpen, setIsOpen, setDate, minimumDate, maximumDate}:PickDateModalProp) => {

  const systemTheme = useColorScheme();
  const { theme, colors } = useTheme();

  const minimum = minimumDate? new Date() : new Date('1950, 0, 1');
  const lockDate = maximumDate? new Date() : new Date(new Date().setDate(new Date().getDate() + 10000));

  const toggleDatePicker = () => {
    setIsOpen(!isOpen)
  }

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (Platform.OS === "android") {
        toggleDatePicker()
        setDate(selectedDate);
      } else {
        setDate(selectedDate);
      }
    }
  };

  return (
    <>
      {Platform.OS === "android" ?(
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <RNDateTimePicker
            display="spinner"
            mode="date"
            value={value}
            minimumDate={minimum}
            maximumDate={lockDate}
            onChange={handleDateChange}
            style={{}}
            locale="en-Gn"
            themeVariant={theme === "system" ? systemTheme == "dark"? 'dark' :'light' : theme == "dark"? 'dark' :'light' }
            // positiveButton={{label: 'OK', textColor: 'green'}}
            // negativeButtonLabel="Negative"
          />
        </Modal>
      ):(
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <View style={{backgroundColor:colors.white}} className= 'w-full h-fit p-4 rounded-normal'>
            <View className='w-full items-center justify-center'>
                <Text style={{color:colors.text}} className='text-heading2 mt-2'>Select Date</Text>
            </View>
            <RNDateTimePicker
              display="spinner"
              mode="date"
              value={value}
              minimumDate={minimum}
              maximumDate={lockDate}
              onChange={handleDateChange}
              style={{}}
              locale="en-Gn"
              themeVariant={theme === "system" ? systemTheme == "dark"? 'dark' :'light' : theme == "dark"? 'dark' :'light' }
              />
            <View className='w-full items-end justify-end'>
              <TouchableOpacity onPress={()=>{setIsOpen(false)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
                <Text className='w-fit text-white text-heading2 font-notoMedium'>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      </>
  )
}

export default PickDateModal