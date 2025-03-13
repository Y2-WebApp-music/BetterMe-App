import { View, Text, TouchableOpacity, Dimensions, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Image } from 'expo-image';
import { useTheme } from '../../context/themeContext'
import { useAuth } from "../../context/authContext";
import { PenIcon } from '../../constants/icon';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { AntDesign as Icon } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const screenWidth = Dimensions.get('window').width;

type TextInputCommentProp = {
  comment:string
  setComment:(comment:string) => void
  submit: () => void
}
const TextInputComment = ({comment, setComment, submit}:TextInputCommentProp) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const triggerMediumHaptics = async () => {
    comment === '' && await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    console.log('Haptics triggered');
  };

  const triggerSuccessHaptics = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    console.log('Haptics triggered');
  };

  const defaultWidth = screenWidth * 0.84;
  const expandedWidth = screenWidth * 0.70;

  const inputWidth = useSharedValue(defaultWidth);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);

  const animateCheck = (text: string) => {
    if (text.length > 0) {
      // Expand input field & show button
      inputWidth.value = withTiming(expandedWidth, { duration: 200 });
      buttonOpacity.value = withTiming(1, { duration: 200 });
      buttonScale.value = withSpring(1);
    } else {
      // Shrink input field & hide button
      inputWidth.value = withTiming(defaultWidth, { duration: 200 });
      buttonOpacity.value = withTiming(0, { duration: 200 });
      buttonScale.value = withSpring(0.8);
    }
  }

  const handleTextChange = (text: string) => {
    setComment(text);
    animateCheck(text);
  };

  const animatedInputStyle = useAnimatedStyle(() => ({
    width: inputWidth.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePost = useCallback(async () => {
    if (!comment.trim()) return;
    console.log("Create Comment", comment);
    triggerSuccessHaptics()
    submit()
  }, [comment]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, width:"100%",alignItems:'center', position:'relative' }}
    >
    <View className='w-full mb-2'>
        <View className='w-full flex-row gap-1 items-center justify-center p-1 px-2'>
          <View className='rounded-full overflow-hidden'>
            <Image
              style={styles.image}
              source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../assets/maleAvatar.png') : require('../../assets/femaleAvatar.png')}
              contentFit="cover"
              transition={100}
            />
          </View>
          <View style={{flex:1}}>
          <View className="flex-row gap-1">
              <Animated.View style={animatedInputStyle}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.white, borderColor: colors.gray, color: colors.text }
                  ]}
                  placeholder="Write a comment..."
                  value={comment}
                  onPress={triggerMediumHaptics}
                  onChangeText={handleTextChange}
                  keyboardType="default"
                />
              </Animated.View>
              <Animated.View style={[animatedButtonStyle,{justifyContent:'center'}]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.icon, { backgroundColor: colors.primary, paddingHorizontal:12 }]}
                  onPress={handlePost}
                >
                  <Icon name="arrowup" color="#fff" size={28} />
                </TouchableOpacity>
              </Animated.View>
            </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
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
    width:'100%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:99,
    paddingVertical:4
  },
});

export default TextInputComment;