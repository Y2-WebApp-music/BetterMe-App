import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Modal from './Modal'
import { Picker } from '@react-native-picker/picker'
import { useTheme } from '../../context/themeContext'
import { useColorScheme } from 'react-native'

type numberModalProp = {
  title:string
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  min:number
  max:number
  start:number
  dotMax:number
  unit:string
  setNumber:(number:number)=> void
}

const PickNumberModal = ({title, min, max, start, dotMax, unit, isOpen, setIsOpen, setNumber}:numberModalProp) => {

  const systemTheme = useColorScheme();
  const { theme, colors } = useTheme();

  const [selectedNumber, setSelectedNumber] = useState<string>(start.toString());
  const [selectedNumberDot, setSelectedNumberDot] = useState("0");
  const number = Array.from({ length: max - min + 1 }, (_, i) => (i + min).toString());
  const numberDot = Array.from({ length: dotMax }, (_, i) => i.toString());

  const handleNumberChange = (newNumber: string) => {
    setSelectedNumber(newNumber);
    const combinedNumber = parseFloat(`${newNumber}.${selectedNumberDot}`);
    setNumber(combinedNumber);
  };

  const handleNumberDotChange = (newNumberDot: string) => {
    setSelectedNumberDot(newNumberDot);
    const combinedNumber = parseFloat(`${selectedNumber}.${newNumberDot}`);
    setNumber(combinedNumber);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View style={{backgroundColor:colors.white}} className= 'w-full p-4 rounded-normal'>
        <View className='w-full items-center justify-center'>
          <Text style={{color:colors.text}} className='text-heading2 mt-2'>{title}</Text>
        </View>
        <View className='flex flex-row my-2 items-center justify-center'>
          <View className='flex flex-row items-center'>
            <Picker
              selectedValue={selectedNumber}
              onValueChange={handleNumberChange}
              style={{ width: 110 }}
            >
              {number.map((num) => (
                <Picker.Item key={num} label={num} value={num} color={theme === "system" ? systemTheme == "dark"? 'white' :'black' : theme == "dark"? 'white' :'black' }/>
              ))}
            </Picker>
            <View style={{width:4,height:4,backgroundColor:theme === "system" ? systemTheme == "dark"? 'white' :'black' : theme == "dark"? 'white' :'black', borderRadius:50,transform:[{ translateY: 8 }]}}></View>
            <Picker
              selectedValue={selectedNumberDot}
              onValueChange={handleNumberDotChange}
              style={{ width: 100, color:theme === "system" ? systemTheme == "dark"? 'white' :'black' : theme == "dark"? 'white' :'black' }}
            >
              {numberDot.map((num) => (
                <Picker.Item key={num} label={num} value={num} color={theme === "system" ? systemTheme == "dark"? 'white' :'black' : theme == "dark"? 'white' :'black' }/>
              ))}
            </Picker>
            <Text style={{color:colors.subText}} className='translate-y-3 text-body'>{unit}</Text>
          </View>
        </View>
        <View className='w-full items-end justify-end'>
          <TouchableOpacity onPress={()=>{setIsOpen(false)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default PickNumberModal