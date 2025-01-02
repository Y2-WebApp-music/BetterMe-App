import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'

const CommunityFeed = () => {
  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
          showsVerticalScrollIndicator={false}
        >
          <View className='mb-4 flex flex-row gap-2 items-center'>
            <Text>Feed Community</Text>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default CommunityFeed