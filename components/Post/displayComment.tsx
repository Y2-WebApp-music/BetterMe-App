import { View, Text, TouchableOpacity, Animated, Easing, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Comment } from '../../types/community'
import { Image } from 'expo-image';
import { useTheme } from '../../context/themeContext'

const screenWidth = Dimensions.get('window').width;

const DisplayComment = ({ username, profile_img, content}:Comment) => {
  const { colors } = useTheme();
  
  return (
    <View style={{paddingHorizontal:14, borderColor:colors.gray}} className='w-full border-b pb-2 mb-2 '>
      
    <View className='my-2 flex-row items-start gap-2'>
      <TouchableOpacity activeOpacity={0.6} style={{borderColor:colors.gray}} className='overflow-hidden rounded-full border'>
        <Image
          style={styles.image}
          source={profile_img}
          contentFit="cover"
          transition={1000}
        />
      </TouchableOpacity>

      <View className='flex-1'>
          <Text style={{color:colors.text}} className='text-heading3 font-noto'>{username}</Text>
          <Text style={{color:colors.subText}} className='text-detail font-notoLight'>11 May 2024</Text>
      </View>
    </View>
    <View>
      <Text style={{color:colors.text}} className='text-body font-noto ml-6'>{content}</Text>
    </View>
    </View>
    
  ) 
}


export default DisplayComment

const styles = StyleSheet.create({
image: {
    justifyContent: 'center',
    width:screenWidth * 0.11,
    height:screenWidth * 0.11,
    alignContent:'center',
  },
});


