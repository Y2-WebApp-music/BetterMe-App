import React, { useState } from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon, OptionIcon } from '../../constants/icon'
import { useTheme } from '../../context/themeContext';
import { PostContent, TagCommunity } from '../../types/community';
import { View, Text,TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, FlatList} from 'react-native'
import FollowButton from './followButton';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../context/authContext';
import { formatNumber, TagList } from './postConstants';
import { format } from 'date-fns';


type PostWithPhotoProp = {
  openComment : (post_id:string) => void
}

const PostOnlyText = ({ openComment, post_id, ...props }: PostContent & PostWithPhotoProp) => {

  const { colors } = useTheme();
  const { user } = useAuth()

  const screenWidth = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    image: {
      justifyContent: 'center',
      width:screenWidth * 0.11,
      height:screenWidth * 0.11,
      alignContent:'center',
    },
  });

  const [data, setData]= useState<PostContent>({
      _id:'string',
      username:'Alex Kim',
      date:'2025-02-04T05:54:45.558+00:00',
      profile_img:'https://picsum.photos/270',
      post_id:'wj54knwgeavi89q45ui3gv',
      content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
      tag:[1,2,3,4],
      like:4123,
      comment:1345,
      photo:[],
    })

  return (
    <View style={{paddingHorizontal:14, borderColor:colors.gray}} className='w-full border-b pb-2 '>
      
      <View style={{backgroundColor:colors.background}} className=' flex-row gap-2 items-center justify-between '>

        <View className='my-2 items-center flex-row gap-2'>
          <TouchableOpacity onPress={()=>{router.push(`${props._id === user?._id? `/community/userProfile`: `/community/user/${props._id}`}`)}} activeOpacity={0.6} style={{borderColor:colors.gray}}  className='overflow-hidden rounded-full border'>
            <Image
            style={styles.image}
            source={require('../../assets/maleAvatar.png')}
            contentFit="cover"
            transition={1000}/>
          </TouchableOpacity>
          <View>
            <Text style={{color:colors.text}} className='text-heading3 font-noto'>{props.username}</Text>
            <Text style={{color:colors.subText}} className='text-detail font-notoLight'>{format(props.date,'dd MMM yyy HH:mm')}</Text>
          </View>
        </View>

        {props._id === user?._id ? (
          <TouchableOpacity className="flex-row rounded-full p-1 px-2">
            <OptionIcon width={24} height={24} color={colors.darkGray}/>
          </TouchableOpacity>
        ):(
          <View>
            <FollowButton userPostID={props._id}/>
          </View>
        )}
    </View>

    <TouchableWithoutFeedback onPress={()=>{router.push(`(post)/${post_id}`);}}>
      <Text style={{color:colors.text}} className='text-body font-noto' >
        {props.content}
      </Text>
    </TouchableWithoutFeedback>


    <View style={{paddingBottom:8}} className="mt-2 flex-row gap-2 items-center justify-between">
      <View style={{gap:14}} className=" items-end flex-row">
        <TouchableOpacity className=" flex-row gap-1 items-center">
          <LikeIcon width={26} height={26} color={colors.darkGray}/>
          <Text style={{color:colors.subText}} className='text-body font-noto'>
            {formatNumber(props.like)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{openComment(post_id)}} className=" flex-row gap-1 items-center">
          <CommentIcon width={26} height={26}color={colors.darkGray}/>
          <Text style={{color:colors.subText}} className='text-body font-noto'>
            {formatNumber(props.comment)}
          </Text>
        </TouchableOpacity>
      </View>

      <View className=" flex-row gap-1">
        <TagList tagId={data.tag}/>
      </View>
    </View>

  </View>

  
  )


}

export default PostOnlyText