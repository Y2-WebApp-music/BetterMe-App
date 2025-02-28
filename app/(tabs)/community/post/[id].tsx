import { View, Text, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import BackButton from '../../../../components/Back';
import PostOnlyText from '../../../../components/Post/postOnlyText';
import DisplayComment from '../../../../components/Post/displayComment';
import TextInputComment from '../../../../components/Post/textInputComment';
import { FlashList } from '@shopify/flash-list';
import { postDummy } from '../../../../types/community';


const CommunityPost = () => {

  const { id } = useLocalSearchParams();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <View className='w-[92%]'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/menu'}/>
          </View>
        </View>
        <ScrollView
          className='w-[96%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <PostOnlyText/>
          <Text className='p-3'>3421 Comment</Text>
          <TextInputComment/>
          <FlashList
            data={postDummy}
            renderItem={({ item }) =>
            <DisplayComment 
              username={item.username}
              profile_img={item.profile_img}
              content={item.content}
            />
            }
            estimatedItemSize={200}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CommunityPost