import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import BottomModal from './BottomModal'
import {  gender } from '../../types/user'
import { useTheme } from '../../context/themeContext'

type GenderModalProp = {
  userGender:number
  update:(activityItem:number) => void
  genderModal:boolean
  setGenderModal:(activityModal:boolean) => void
}
const GenderModal = ({userGender, genderModal, setGenderModal, update}:GenderModalProp) => {

  const { colors } = useTheme();

  return (
    <BottomModal
      isOpen={genderModal}
      setIsOpen={setGenderModal}
    >
      <View className= 'w-full p-2 flex gap-2'>
        <View className='w-full items-center justify-center'>
          <Text style={{color:colors.text}} className='text-heading2 py-2'>select gender</Text>
        </View>
        {gender.map((activityItem) => (
          <TouchableOpacity
            key={activityItem.id}
            onPress={() => update(activityItem.id)}
            className={`rounded-normal border p-2`}
            style={{borderColor:activityItem.id === userGender ?colors.primary:colors.gray}}
          >
            <Text
              className={`text-heading2 font-noto h-[3vh]`}
              style={{color:activityItem.id === userGender ?colors.primary:colors.text}}
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