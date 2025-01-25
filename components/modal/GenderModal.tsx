import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import BottomModal from './BottomModal'
import {  gender } from '../../types/user'

type GenderModalProp = {
  userGender:number
  update:(activityItem:number) => void
  genderModal:boolean
  setGenderModal:(activityModal:boolean) => void
}
const GenderModal = ({userGender, genderModal, setGenderModal, update}:GenderModalProp) => {
  return (
    <BottomModal
      isOpen={genderModal}
      setIsOpen={setGenderModal}
    >
      <View className= 'w-full p-2 flex gap-2'>
        <View className='w-full items-center justify-center'>
          <Text className='text-heading2 py-2'>select gender</Text>
        </View>
        {gender.map((activityItem) => (
          <TouchableOpacity
            key={activityItem.id}
            onPress={() => update(activityItem.id)}
            className={`${
              activityItem.id === userGender ? 'border-primary' : 'border-gray'
            } rounded-normal border p-2`}
          >
            <Text
              className={`${
                activityItem.id === userGender ? 'text-primary' : 'text-text'
              } text-heading2 font-noto h-[3vh]`}
            >
              {activityItem.gender}
            </Text>
          </TouchableOpacity>
          ))
        }
      </View>
    </BottomModal>
  )
}

export default GenderModal