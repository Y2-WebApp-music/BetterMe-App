import { View, Text, TouchableOpacity, Dimensions, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image';
import { useTheme } from '../../context/themeContext'
import { useAuth } from "../../context/authContext";
import { PenIcon } from '../../constants/icon';

const screenWidth = Dimensions.get('window').width;

const TextInputComment = () => {
  const { colors } = useTheme();
  const { user } = useAuth()
  const [typing, setTyping] = useState(false);
  const [comment, setComment] = useState('');

  const handleCancel = () => {
    setTyping(false);
    setComment('');
  };

  const handlePost = () => {
    setTyping(false);
    setComment('');
  };

  return (
    <View className='w-full px-4 mb-2'>
      {!typing ? (
        <View className='w-full flex-row gap-1 items-center justify-center'>
            <View className='rounded-full overflow-hidden'>
              <Image
                style={styles.image}
                source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../assets/maleAvatar.png') : require('../../assets/femaleAvatar.png')}
                contentFit="cover"
                transition={10}
              />
            </View>
          <View className='grow'>
            <View style={{ position: 'relative' }}>
              <TextInput 
                style={[
                  styles.input, 
                  { backgroundColor: colors.white, borderColor: colors.gray, paddingRight: 40 }
                ]}
                placeholder='write some comment...'
                onFocus={() => setTyping(true)}
              />
              <PenIcon width={24} height={24} color={colors.primary} style={styles.icon} />
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View className='my-2 flex-row items-start gap-2'>
              <View className='rounded-full overflow-hidden'>
                <Image
                  style={styles.image}
                  source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../assets/maleAvatar.png') : require('../../assets/femaleAvatar.png')}
                  contentFit="cover"
                  transition={10}
                />
              </View>          
            <View className='flex-1'>
              <Text style={{color:colors.text}} className='text-heading2 font-notoMedium'>{user?.displayName}</Text>
              <Text style={{color:colors.subText}} className='text-detail font-notoLight'>11 May 2024</Text>
            </View>
          </View>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.white, borderColor: colors.gray, paddingRight: 40 }]} placeholder='write some comment...' onFocus={() => setTyping(true)}/>
          <View className='flex-row justify-end gap-2'>
            <TouchableOpacity onPress={handleCancel} style={{backgroundColor:colors.nonFocus}} className='mt-4 p-1 px-4 rounded-full justify-center items-center'>
              <Text className='text-white font-noto text-heading2'>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePost} className='mt-4 p-1 px-4 rounded-full justify-center items-center bg-primary'>
              <Text className='text-white font-noto text-heading2'>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    width: screenWidth * 0.11,
    height: screenWidth * 0.11,
    alignContent: 'center',
  },
  input: {
    borderRadius: 99,
    fontSize: 16,
    lineHeight: 20,
    padding: 10,
    borderWidth: 1,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    borderRadius: 99,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
  }
});

export default TextInputComment;
