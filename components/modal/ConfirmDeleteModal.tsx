import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from './Modal'


type ConfirmModalProp = {
  title:string
  detail:string
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  handelDelete:()=>void
  deleteType: 'Delete' | 'Cancel'
}

const ConfirmDeleteModal = ({title, detail, deleteType, isOpen, setIsOpen, handelDelete}:ConfirmModalProp) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View className= 'w-full bg-white h-fit p-4 rounded-normal'>
        <View className='w-full items-start justify-center flex gap-2'>
            <Text className='text-heading mt-2'>{deleteType} this {title}?</Text>
            <Text className='text-subText font-notoLight'>{detail}</Text>
        </View>
        <View className='mt-4 w-full items-center justify-center flex-row gap-4'>
          <TouchableOpacity style={{backgroundColor:'#f43168'}} onPress={handelDelete} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-red'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>{deleteType} it</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'#0dc47c'}} onPress={()=>{setIsOpen(false)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-green'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>No keep it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
// This will delete delete permanently. You cannot undo this action.

export default ConfirmDeleteModal