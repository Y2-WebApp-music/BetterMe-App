import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Modal from './Modal'
import { useTheme } from '../../context/themeContext'
import * as Haptics from 'expo-haptics';

type ConfirmModalProp = {
  title:string
  detail:string
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
}

const WarningModal = ({title, detail, isOpen, setIsOpen}:ConfirmModalProp) => {

  const { colors } = useTheme();
  

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View style={{backgroundColor:colors.white}} className= 'w-full h-fit p-4 rounded-normal'>
        <View className='w-full items-start justify-center flex gap-2'>
            <Text style={{color:colors.yellow}} className='text-heading mt-2'>{title}</Text>
            <Text style={{color:colors.subText}} className='font-notoLight'>{detail}</Text>
        </View>
        <View className='mt-4 w-full items-end justify-end flex-row gap-4'>
          <TouchableOpacity style={{backgroundColor:'#1c60de'}} onPress={()=>{setIsOpen(false)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default WarningModal