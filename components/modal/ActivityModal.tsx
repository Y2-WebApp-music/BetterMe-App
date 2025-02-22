import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import BottomModal from './BottomModal'
import { activity } from '../../types/user'
import { useTheme } from '../../context/themeContext'

type ActivityModalProp = {
  userActivity:number
  update:(activityItem:number) => void
  activityModal:boolean
  setActivityModal:(activityModal:boolean) => void
}
const ActivityModal = ({userActivity, activityModal, setActivityModal, update}:ActivityModalProp) => {

  const { colors } = useTheme();

  return (
    <BottomModal
      isOpen={activityModal}
      setIsOpen={setActivityModal}
    >
      <View className= 'w-full p-2 flex gap-2'>
        <View className='w-full items-center justify-center'>
          <Text style={{color:colors.text}} className='text-heading2 py-2'>select your activity</Text>
        </View>
        {activity.map((activityItem) => (
          <TouchableOpacity
            key={activityItem.id}
            onPress={() => update(activityItem.id)}
            className={`rounded-normal border p-2`}
            style={{borderColor:activityItem.id === userActivity ? colors.primary : colors.gray}}
          >
            <Text
              className={`text-heading2 font-noto h-[3vh]`}
              style={{color:activityItem.id === userActivity ? colors.primary : colors.text}}
            >
              {activityItem.title}
            </Text>
            <Text style={{color:colors.subText}} >{activityItem.description}</Text>
            </TouchableOpacity>
          ))
        }
      </View>
    </BottomModal>
  )
}

export default ActivityModal