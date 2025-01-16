import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Dimensions, StyleSheet, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import BackButton from '../../../components/Back';
import { LeftArrowIcon } from '../../../constants/icon';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowIcon } from '../../../constants/icon';

const screenWidth = Dimensions.get('window').width;

const AccountSetting = () => {

  const { user } = useAuth();

  const { signOut } = useAuth(); // Access signOut function

  const handleSignOut = async () => {
    await signOut();
  };


  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <ScrollView
            className='w-[92%] h-auto'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode='on-drag'
          >
            <View className='w-full'>
              <View className='max-w-[14vw]'>
                <BackButton goto={'/menu'}/>
              </View>
            </View>
            <View className='mt-2'>
              <View className='flex flex-row gap-2 items-center'>
                <View className='grow'>
                  <Text className='text-subTitle text-primary font-notoMedium'>Account Setting</Text>
                </View>
                <View>
                  <TouchableOpacity className=' bg-primary flex-row gap-2 p-2 px-6 justify-center items-center rounded-full'>
                    <Text className='text-heading2 text-white font-notoMedium'>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className='mb-4 flex flex-row gap-2 items-center'>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={require('../../../assets/maleAvatar.png')}
                  contentFit="cover"
                  transition={1000}
                />
              </View>
              <View className='grow'>
                <Text className='grow text-xs text-subText'>username</Text>
                <View style={styles.input}>
                  <Text>{user?.displayName}</Text>
                </View>
                <Text className='grow text-xs text-subText'>email</Text>
                <View style={styles.input}>
                  <Text>{user?.email}</Text>
                </View>
              </View>
            </View>
            {/* personal data */}
            <View className='mt-2 flex-col gap-2 pb-20'>
              <Text className='text-detail'>personal data</Text>
                <View className='grow ml-6'>
                  <Text  className='text-subText'>date of birth</Text>
                  <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray" style={styles.input}>
                    <Text className='text-body'>12 September 1991</Text>
                  </View>
                </View>
                <View className='mt-3 w-full flex-row gap-2 items-center ml-6'>
                  <View className='items-center'>
                    <Text className='grow text-xs text-subText pb-2'>gender</Text>
                    <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center">
                      <Text className="text-body font-notoMedium">Female</Text>
                    </View>
                  </View>
                  <View className='items-center'>
                    <Text className='grow text-xs text-subText pb-2'>weight</Text>
                    <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center">
                      <Text className="text-body font-notoMedium">333</Text>
                      <Text className="text-xs text-subText ml-1">kg</Text>
                    </View>
                  </View>
                  <View className='items-center'>
                    <Text className='grow text-xs text-subText pb-2'>height</Text>
                    <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center">
                      <Text className="text-body font-notoMedium">333</Text>
                      <Text className="text-xs text-subText ml-1">cm</Text>
                    </View>
                  </View>
                </View>
                <View className='ml-6'>
                  <Text className='text-subText'>your activity</Text>
                  <View className="flex-row p-1 px-4 rounded-normal bg-white border border-gray" style={[styles.input, { justifyContent: 'space-between' }]}>
                    <Text>Moderately active</Text>
                    <ArrowIcon width={16} height={16} color={'#626262'}/>
                  </View>
                  <Text className='text-xs text-subText'>Regular moderate exercise 3-5 days a week.</Text>
                </View>
                <Text className='text-xs text-subText ml-6 mt-3'>We collect gender, weight, height, and activity level to calculate your daily caloric needs accurately.</Text>
                <View className="items-start ml-6 mt-3">
                  <View className="flex-col p-1 px-4 rounded-normal bg-white border border-gray items-center justify-center">
                    <Text className="text-xs text-subText">Your daily calorie needs</Text>
                    <View className="flex-row items-baseline">
                      <Text className="text-heading font-notoMedium text-green">2364</Text>
                      <Text className="text-detail text-green ml-1">cal</Text>
                    </View>
                  </View>
                </View>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: '#CFCFCF',
                marginVertical: 20,
                width: '100%',
              }}
            />
            <TouchableOpacity
              onPress={handleSignOut}
              className="flex flex-row items-center justify-center rounded-normal border border-gray p-1 px-4 bg-red-500 mt-6"
            >
              <Text className="text-subText text-heading2 font-notoMedium">Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
)
}

const styles = StyleSheet.create({
  imageContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: (screenWidth * 0.3) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
});

export default AccountSetting