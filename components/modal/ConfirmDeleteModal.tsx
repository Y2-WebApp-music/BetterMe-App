import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from './Modal'


type ConfirmModalProp = {
  title:string
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
  handelDelete:()=>void
}

const ConfirmDeleteModal = ({title, isOpen, setIsOpen, handelDelete}:ConfirmModalProp) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <View className= 'w-full bg-white h-fit p-4 rounded-normal'>
        <View className='w-full items-start justify-center flex gap-2'>
            <Text className='text-heading mt-2'>Delete this {title}?</Text>
            <Text className='text-subText font-notoLight'>This will delete {title} permanently. You cannot undo this action.</Text>
        </View>
        <View className='mt-4 w-full items-center justify-center flex-row gap-4'>
          <TouchableOpacity style={{backgroundColor:'#f43168'}} onPress={handelDelete} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-red'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>Delete it</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'#0dc47c'}} onPress={()=>{setIsOpen(false)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-green'>
            <Text className='w-fit text-white text-heading2 font-notoMedium'>No keep it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmDeleteModal