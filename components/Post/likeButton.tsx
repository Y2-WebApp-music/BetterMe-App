import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LikeIcon } from '../../constants/icon'
import { formatNumber } from './postConstants'
import { useTheme } from '../../context/themeContext'
import axios from 'axios'
import { SERVER_URL } from '@env'
import { useAuth } from '../../context/authContext'

const LikeButton = ({like, post_id}:{like:number, post_id:string}) => {

  const { user } = useAuth()
  const { colors } = useTheme();

  const likeUpdate = async () => {
    
    try {
      const response = await axios.put(`${SERVER_URL}/community/user/like?post_id=${post_id}&user_id=${user?._id}`);
      const data = response.data;
      console.log('data.message ', data.message);

    } catch (error: any) {
      console.error('Like Error: ', error);
    } finally {
    }
  };

  const handleClick = async () => {
    await likeUpdate()
  }

  return (
    <TouchableOpacity className=" flex-row gap-1 items-center">
      <LikeIcon width={26} height={26} color={colors.darkGray}/>
      <Text style={{color:colors.subText}} className='text-body font-noto'>
        {formatNumber(like)}
      </Text>
    </TouchableOpacity>
  )
}

export default LikeButton