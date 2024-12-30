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
  unit:string
  setNumber:(number:number)=> void
}

const PickNumberModal = ({title, min, max, start, dotMax, unit, isOpen, setIsOpen, setNumber}:numberModalProp) => {

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
      <View className= 'w-full bg-white p-4 rounded-normal'>
        <View className='w-full items-center justify-center'>
          <Text className='text-heading2 mt-2'>{title}</Text>
        </View>
        <View className='flex flex-row my-2 items-center justify-center'>
          <View className='flex flex-row items-center'>
            <Picker
              selectedValue={selectedNumber}
              onValueChange={handleNumberChange}
              style={{ width: 100 }}
            >
              {number.map((num) => (
                <Picker.Item key={num} label={num} value={num} color='black'/>
              ))}
            </Picker>
            <View style={{width:4,height:4,backgroundColor:'black', borderRadius:50,transform:[{ translateY: 8 }]}}></View>
            <Picker
              selectedValue={selectedNumberDot}
              onValueChange={handleNumberDotChange}
              style={{ width: 100, color:'black' }}
            >
              {numberDot.map((num) => (
                <Picker.Item key={num} label={num} value={num} color='black' />
              ))}
            </Picker>
            <Text className='translate-y-3 text-subText text-body'>{unit}</Text>
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