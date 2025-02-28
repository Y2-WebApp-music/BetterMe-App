import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { AddIcon } from '../../constants/icon';

const FollowButton = () => {
  const [following, setFollowing] = useState(false);

  const handleFollow = () => {
    setFollowing(!following);
  };

  return (
    <TouchableOpacity 
      onPress={handleFollow} 
      className={`flex-row gap-2 p-1 px-1 justify-center items-center rounded-full w-auto ${following ? 'bg-gray' : 'bg-primary'}`}
      style={{paddingHorizontal: 10,  alignSelf: 'flex-start', }}
    >
      <Text className={`text-detail font-notoMedium ${following ? 'text-subText' : 'text-white'}`}>
        {following ? 'following' : 'follow'}
      </Text>
      {!following && (
        <AddIcon width={20} height={20} color={'white'}/>
      )}
    </TouchableOpacity>
  )
}

export default FollowButton;
