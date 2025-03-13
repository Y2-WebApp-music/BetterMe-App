import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AddIcon } from '../../constants/icon';
import { useTheme } from '../../context/themeContext';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const FollowButton = ({userPostID}:{userPostID:string}) => {

  const { user, userFollow, setUserFollow } = useAuth()
  const { colors } = useTheme();

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const triggerMediumHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    console.log('Haptics triggered');
  };

  useLayoutEffect(() => {
    if (userFollow && userPostID) {
      setIsFollowing(userFollow.following.includes(userPostID));
    }
  }, [userFollow, userPostID]);

  const followUpdate = async () => {
    if (!user || loading) return;

    setLoading(true);
    
    try {
      const response = await axios.put(`${SERVER_URL}/community/user/follow?user_id=${userPostID}&follower_id=${user._id}`);
      const data = response.data;
      console.log('data.message ', data.message);

      setIsFollowing(!isFollowing);
    } catch (error: any) {
      console.error('Follow Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const getFollowData = async (_id:string) => {
    try {
      await AsyncStorage.removeItem('@follow');

      const response = await axios.get(`${SERVER_URL}/user/follow/${_id}`);
      const res = response.data

      if ( res.message === "User not found") { return console.log('User not found in follow');}

      setUserFollow({
        follower: res.follower,
        following: res.following,
      })

      await AsyncStorage.setItem('@follow', JSON.stringify(res));
    } catch (error) {
      console.error('followUser get failed', error);
    }
  }

  const handleFollow = async () => {
    triggerMediumHaptics()
    await followUpdate().finally(()=>{user && getFollowData(user._id)})
  };
  

  return (
    <TouchableOpacity
      onPress={handleFollow}
      className={`flex-row gap-1 p-1 px-1 justify-center items-center rounded-full w-auto`}
      style={{
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        backgroundColor: isFollowing ? colors.gray : colors.primary,
        paddingLeft: isFollowing ? 12 : 14,
      }}
      disabled={loading}
    >
      <Text style={{ color: isFollowing ? colors.subText : '#fff' }} className={`text-body font-notoMedium`}>
        {loading ? 'Loading' : isFollowing ? 'Following' : 'Follow'}
      </Text>
      {!isFollowing && !loading && (
        <AddIcon width={24} height={24} color={'white'} />
      )}
      {loading && (
        <Text style={{ color: '#fff' }}>...</Text>
      )}
    </TouchableOpacity>
  );
}

export default FollowButton;
