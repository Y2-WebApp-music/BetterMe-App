import { View, Text, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { router } from 'expo-router';

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
          <View className='mb-4 flex gap-2 items-center'>
            <Text>Feed Community</Text>

            <TouchableOpacity onPress={()=>{router.push('/community/userProfile')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>User Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{router.push('/community/user/123')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>see other user Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{router.push('/community/user/goal/123')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>user goal</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{router.push('/community/post/create')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>Create Post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{router.push('/community/post/edit/123')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>Edit Post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{router.push('/community/post/123')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>See Post</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{router.push('/community/search')}} className=' bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full'>
              <Text className='text-body text-white font-notoMedium'>Search in Community</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default CommunityFeed