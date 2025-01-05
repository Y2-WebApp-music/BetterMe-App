import { View, Text } from 'react-native'
import React from 'react'

const MealCard = () => {
  return (
    <View className='w-full p-3 rounded-normal border border-gray bg-white flex-row items-center justify-center'>
      <View className='max-w-[64vw] grow'>
        <View className='flex-row gap-1 items-center'>
          <View className='h-3 w-3 bg-primary rounded-full'/>
          <Text className='text-subText text-body font-notoMedium'>14:00</Text>
          <Text className='text-DarkGray'>: from Ai</Text>
        </View>
        <View>
          <Text className='font-noto text-heading3 line-clamp-2'>Lorem ipsum dolor Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, dicta aliquam iusto rem ipsa voluptatibus perferendis dolorem provident harum aspernatur pariatur blanditiis quidem excepturi beatae, adipisci voluptatum deleniti facilis repudiandae!</Text>
        </View>
      </View>
      <View className='w-[20vw] justify-end items-end '>
        <Text className='text-[#ABABAB] text-heading2 font-notoMedium'>3333 Cal</Text>
      </View>
    </View>
  )
}

export default MealCard