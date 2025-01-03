import { View, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'

const CommunityFeed = () => {

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className='mb-4 flex flex-row gap-2 items-center'>
            <Text>Feed Community</Text>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default CommunityFeed