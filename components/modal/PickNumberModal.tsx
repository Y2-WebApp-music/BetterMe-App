import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Modal from './Modal'
import { Picker } from '@react-native-picker/picker'

type numberModalProp = {
  title:string
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  min:number
  max:number
  start:number
  dotMax:number
  setNumber:(number:number)=> void
}

const PickNumberModal = ({title, min, max, start, dotMax, isOpen, setIsOpen, setNumber}:numberModalProp) => {

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
      <View className= 'w-full bg-white border border-gray p-4 rounded-normal'>
        <View className='w-full items-center justify-center'>
          <Text className='text-heading2'>{title}</Text>
        </View>
        <View className='flex flex-row my-2 items-center justify-center'>
          <View className='flex flex-row items-center'>
            <Picker
              selectedValue={selectedNumber}
              onValueChange={handleNumberChange}
              style={{ width: 100 }}
            >
              {number.map((num) => (
                <Picker.Item key={num} label={num} value={num} />
              ))}
            </Picker>
            <View className='h-1 w-1 rounded-full bg-black translate-y-3'></View>
            <Picker
              selectedValue={selectedNumberDot}
              onValueChange={handleNumberDotChange}
              style={{ width: 100 }}
            >
              {numberDot.map((num) => (
                <Picker.Item key={num} label={num} value={num} />
              ))}
            </Picker>
            <Text className='translate-y-3 text-subText text-body'>cm</Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{setIsOpen(false)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
          <Text className='w-fit text-white text-heading2 font-notoMedium'>Save</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default PickNumberModal