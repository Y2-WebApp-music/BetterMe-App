import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import BackButton from '../../../../components/Back';

const CreatePost = () => {

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
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          <Text>Create Post</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CreatePost