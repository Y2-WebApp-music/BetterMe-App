import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { ForwardIcon, UserIcon } from '../../../constants/icon'
import { Image } from 'expo-image';
import { useAuth } from '../../../context/authContext';

const screenWidth = Dimensions.get('window').width;

const Menu = () => {

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
            <View className='grow'>
              <Text className='text-heading2 font-notoMedium'>{user?.displayName}</Text>
              <Text className='text-subText font-noto'>{user?.email}</Text>
            </View>
            <View className='overflow-hidden rounded-full'>
              <Image
                style={styles.image}
                source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
                contentFit="cover"
                transition={1000}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={()=>{router.push('/menu/account')}}
            className="flex flex-row gap-2 items-center justify-center rounded-normal border border-gray p-2 px-4 bg-red-500"
          >
            <UserIcon width={30} height={30} color={'#626262'}/>
            <Text className="text-subText text-heading2 grow font-noto">account setting</Text>
            <ForwardIcon width={30} height={30} color={'#CFCFCF'}/>
          </TouchableOpacity>
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

export default Menu