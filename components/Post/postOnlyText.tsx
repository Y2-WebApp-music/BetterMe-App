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
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';
import axios from 'axios';
import { SERVER_URL } from '@env';


type PostWithPhotoProp = {
  openComment : (post_id:string) => void
  openOption : (post_id:string) => void
}

const PostOnlyText = ({ openComment, openOption, post_id, ...props }: PostContent & PostWithPhotoProp) => {

  const { colors } = useTheme();
  const { user } = useAuth()
  const [like, setLike] = useState<number | 0>(props.like)

  const screenWidth = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    image: {
      justifyContent: 'center',
      width:screenWidth * 0.11,
      height:screenWidth * 0.11,
      alignContent:'center',
    },
  });

  const deletePost = async () => {
    console.log('Delete Goal');
    try {
      const response = await axios.delete(`${SERVER_URL}/community/post/delete/${post_id}`);

      let data = response.data

      if (data.message == "Post not found") {
        console.error('Can not find Post ID')
        return
      }

      router.back()

    } catch (err) {
      console.error('Delete Post Fail:', err);
    }
  }

  const [optionVisible, setOptionVisible] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

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
          <TouchableOpacity onPress={()=>{openOption(post_id)}} className="flex-row rounded-full p-1 px-2">
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
          <LikeButton like={like} post_id={post_id} setLike={setLike}/>

          <TouchableOpacity onPress={()=>{openComment(post_id)}} className=" flex-row gap-1 items-center">
            <CommentIcon width={26} height={26}color={colors.darkGray}/>
            <Text style={{color:colors.subText}} className='text-body font-noto'>
              {formatNumber(props.comment)}
            </Text>
          </TouchableOpacity>
        </View>

        <TagList tagId={props.tag}/>
      </View>
      <ConfirmDeleteModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        title='post'
        detail={'This will delete delete permanently. You cannot undo this action.'}
        handelDelete={deletePost}
        deleteType={'Delete'}
      />
    </View>
  )


}

export default PostOnlyText