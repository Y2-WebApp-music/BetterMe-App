import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from './Modal'


type ConfirmModalProp = {
  title:string
  detail:string
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
}

const WarningModal = ({title, detail, isOpen, setIsOpen}:ConfirmModalProp) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View className= 'w-full bg-white h-fit p-4 rounded-normal'>
        <View className='w-full items-start justify-center flex gap-2'>
            <Text className='text-heading mt-2 text-yellow'>{title}</Text>
            <Text className='text-subText font-notoLight'>{detail}</Text>
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