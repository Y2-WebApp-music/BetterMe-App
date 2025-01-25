import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import BottomModal from './BottomModal'
import { activity } from '../../types/user'

type ActivityModalProp = {
  userActivity:number
  update:(activityItem:number) => void
  activityModal:boolean
  setActivityModal:(activityModal:boolean) => void
}
const ActivityModal = ({userActivity, activityModal, setActivityModal, update}:ActivityModalProp) => {
  return (
    <BottomModal
      isOpen={activityModal}
      setIsOpen={setActivityModal}
    >
      <View className= 'w-full p-2 flex gap-2'>
        <View className='w-full items-center justify-center'>
          <Text className='text-heading2 py-2'>select your activity</Text>
        </View>
        {activity.map((activityItem) => (
          <TouchableOpacity
            key={activityItem.id}
            onPress={() => update(activityItem.id)}
            className={`${
              activityItem.id === userActivity ? 'border-primary' : 'border-gray'
            } rounded-normal border p-2`}
          >
            <Text
              className={`${
                activityItem.id === userActivity ? 'text-primary' : 'text-text'
              } text-heading2 font-noto h-[3vh]`}
            >
              {activityItem.title}
            </Text>
            <Text className='text-subText'>{activityItem.description}</Text>
            </TouchableOpacity>
          ))
        }
      </View>
    </BottomModal>
  )
}

export default ActivityModal