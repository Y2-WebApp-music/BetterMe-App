import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated'
import { LikeIcon } from '../../constants/icon'
import { formatNumber } from './postConstants'
import { useTheme } from '../../context/themeContext'
import axios from 'axios'
import { SERVER_URL } from '@env'
import { useAuth } from '../../context/authContext'
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'

type LikeButtonProp = {
  post_id:string
  like:number
  setLike:(like:number) => void
}

const LikeButton = ({ like, post_id, setLike }:LikeButtonProp) => {
  const { user, likedPost, setLikedPost } = useAuth()
  const systemTheme = useColorScheme();
  const { colors, theme } = useTheme()
  
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const triggerMediumHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    console.log('Haptics triggered');
  };

  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)
  const rotate = useSharedValue(0)
  const iconColor = useSharedValue(theme === "system" ? systemTheme == "dark"? '#303032': '#CFCFCF' : theme == "dark"? '#303032': '#CFCFCF')

  const iconColorStyle = useAnimatedStyle(() => ({
    color: withTiming(iconColor.value, { duration: 300, easing: Easing.ease })
  }))

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` }
    ]
  }))

  const likeUpdate = async () => {
    if (!user?._id) return

    setIsLoading(true)

    try {
      const response = await axios.put(`${SERVER_URL}/community/post/like?post_id=${post_id}&user_id=${user._id}`)

      if (response.data) {
        setIsLiked((prev) => !prev)
        setLike(isLiked ? like - 1 : like + 1);
        console.warn('Like :', response.data?.message)
      } else {
        console.warn('Like Failed:', response.data?.message)
      }
    } catch (error: any) {
      console.error('Like Error:', error?.response?.data || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getLikedPost = async (_id:string) => {
    try {
      await AsyncStorage.removeItem('@liked');

      const response = await axios.get(`${SERVER_URL}/community/like-post/${_id}`);
      const res = response.data

      if ( res.message === "User not found") { return console.log('User not found');}

      console.log('like res ',res);
      setLikedPost(res)

      await AsyncStorage.setItem('@liked', JSON.stringify(res));
    } catch (error) {
      console.error('followUser get failed', error);
    }
  }

  const handleClick = useCallback(async () => {
    if (isLoading) return

    triggerMediumHaptics()

    if (!isLiked) {
      scale.value = withTiming(1.3, { duration: 400, easing: Easing.out(Easing.ease) })
      translateY.value = withTiming(-25, { duration: 300, easing: Easing.out(Easing.ease) }, () => {
        rotate.value = withTiming(15, { duration: 100, easing: Easing.out(Easing.ease) }, () => {
          rotate.value = withTiming(0, { duration: 100 })
        })
        translateY.value = withTiming(0, { duration: 200 })
        scale.value = withTiming(1, { duration: 200 })
      })

      iconColor.value = '#f43168'
    } else {
      iconColor.value = theme === "system" ? systemTheme == "dark"? '#303032': '#CFCFCF' : theme == "dark"? '#303032': '#CFCFCF'
    }

    await likeUpdate().finally(()=>{user && getLikedPost(user._id)})
  },[isLiked, isLoading])

  useLayoutEffect(() => {
    if (likedPost && post_id) {
      setIsLiked(likedPost.includes(post_id));
      if(likedPost.includes(post_id)) {iconColor.value = '#f43168'}
    }
  }, [likedPost, post_id]);

  return (
    <TouchableOpacity
      onPress={handleClick}
      className="flex-row gap-1 items-center"
      disabled={isLoading}
      activeOpacity={1}
    >
      <View style={{position:'relative', zIndex:999, transform:[{scale:1.2}]}}>
        <Animated.View style={[animatedStyle,{position:'absolute', zIndex:999}]}>
          <Animated.Text style={[iconColorStyle]}>
            <MaterialCommunityIcons
              name="cards-heart"
              size={26}
            />
          </Animated.Text>
        </Animated.View>
        <MaterialCommunityIcons name="cards-heart-outline" size={26} color={colors.darkGray} />
      </View>
      <Text style={{ color: colors.subText }} className="text-body font-notoMedium">
        {formatNumber(like)}
      </Text>
    </TouchableOpacity>
  )
}

export default LikeButton