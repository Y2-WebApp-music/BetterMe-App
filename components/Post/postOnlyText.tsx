import React, { useState } from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon, OptionIcon, PenIcon, DeleteIcon } from '../../constants/icon'
import { useTheme } from '../../context/themeContext';
import { PostContent, TagCommunity } from '../../types/community';
import { View, Text,TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, FlatList} from 'react-native'
import FollowButton from './followButton';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../context/authContext';
import { formatNumber, TagList } from './postConstants';
import { format } from 'date-fns';
import LikeButton from './likeButton';


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

  const [openDeleteModal,setOpenDeleteModal] = useState(false)
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const toggleOptions = () => { setOptionsVisible(!isOptionsVisible) };
  const closeOptions = () => { setOptionsVisible(false) };

  return (
    <View style={{paddingHorizontal:14, borderColor:colors.gray}} className='w-full border-b pb-2 '>
      
      <View style={{backgroundColor:colors.background}} className=' flex-row gap-2 items-center justify-between '>

        <View className='my-2 items-center flex-row gap-2'>
          <TouchableOpacity onPress={()=>{router.push(`${props._id === user?._id? `/community/userProfile`: `/community/user/${props._id}`}`)}} activeOpacity={0.6} style={{borderColor:colors.gray}}  className='overflow-hidden rounded-full border'>
          <Image
            style={styles.image}
            source={props.profile_img}
            contentFit="cover"
            transition={200}
          />
          </TouchableOpacity>
          <View>
            <Text style={{color:colors.text}} className='text-heading3 font-noto'>{props.username}</Text>
            <Text style={{color:colors.subText}} className='text-detail font-notoLight'>{format(props.date,'dd MMM yyy HH:mm')}</Text>
          </View>
        </View>

        {props._id === user?._id ? (
          <TouchableOpacity onPress={toggleOptions} className="flex-row rounded-full p-1 px-2">
            <OptionIcon width={24} height={24} color={colors.darkGray}/>
          </TouchableOpacity>
        ):(
          <View>
            <FollowButton userPostID={props._id}/>
          </View>
        )}

        {isOptionsVisible && (
          <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className='absolute z-20 right-0 top-6 min-h-24 min-w-32 rounded-normal border p-4 flex-col gap-2'>
            <TouchableOpacity onPress={()=>{router.push(`(post)/edit/${post_id}`)}} style={{borderColor:colors.gray}} className='p-2 px-4 border rounded-normal flex-row gap-2 justify-start items-center'>
              <PenIcon width={26} height={26} color={colors.darkGray} />
              <Text style={{color:colors.subText}} className='font-noto text-heading3'>Edit post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setOpenDeleteModal(!openDeleteModal)}} style={{borderColor:colors.gray}} className='p-2 px-4 border rounded-normal flex-row gap-2 justify-start items-center'>
              <DeleteIcon width={26} height={26} color={colors.darkGray} />
              <Text style={{color:colors.subText}} className='font-noto text-heading3'>delete post</Text>
            </TouchableOpacity>
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
          <LikeButton like={props.like} post_id={post_id}/>

          <TouchableOpacity onPress={()=>{openComment(post_id)}} className=" flex-row gap-1 items-center">
            <CommentIcon width={26} height={26}color={colors.darkGray}/>
            <Text style={{color:colors.subText}} className='text-body font-noto'>
              {formatNumber(props.comment)}
            </Text>
          </TouchableOpacity>
        </View>

        <TagList tagId={props.tag}/>
      </View>
    </View>
  )


}

export default PostOnlyText