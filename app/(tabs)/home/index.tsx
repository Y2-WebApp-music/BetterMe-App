import { View, Text, ScrollView, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../context/authContext';

const screenWidth = Dimensions.get('window').width;

type UserData = User & {
}

const Home = () => {

  const { user } = useAuth();

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          <View className='mb-4 flex flex-row gap-2 items-center'>
            <View className='overflow-hidden rounded-full'>
              <Image
                style={styles.image}
                source={require('../../../assets/maleAvatar.png')}
                contentFit="cover"
                transition={1000}
              />
            </View>
            <View className='grow'>
              <Text className='text-heading2 font-notoMedium'>{user?.displayName}</Text>
              <Text className='text-subText font-noto'>{user?.email}</Text>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    width:screenWidth * 0.2,
    height:screenWidth * 0.2,
    alignContent:'center',
  },
});

export default Home