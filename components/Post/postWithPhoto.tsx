import { format } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, Animated as ReactAnimated, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ViewToken } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView, } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { CommentIcon, DeleteIcon, OptionIcon, PenIcon } from '../../constants/icon';
import { useAuth } from '../../context/authContext';
import { useTheme } from '../../context/themeContext';
import { PostContent } from '../../types/community';
import FollowButton from './followButton';
import LikeButton from './likeButton';
import PageNum from './pageNum';
import Pagination from './pagination';
import { formatNumber, TagList } from './postConstants';
import SlideItem from './slideItem';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SERVER_URL } from '@env';
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';

const screenWidth = Dimensions.get('window').width;

type PostWithPhotoProp = {
  openComment : (post_id:string) => void
}

const PostWithPhoto = ({ openComment, post_id, ...props }: PostContent & PostWithPhotoProp) => {

  const { colors } = useTheme();
  const { user, likedPost, setLikedPost } = useAuth()
  

  const [index, setIndex] = useState(0);
  const scrollX = useRef(new ReactAnimated.Value(0)).current;

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    ReactAnimated.event([
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],
    {
      useNativeDriver: false,
    },
  )(event);
  };

  const handleOnViewableItemChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setIndex(viewableItems[0]?.index ?? 0);
    }
  ).current;
  

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;
  
  const scale = useSharedValue(0)
  const translateY = useSharedValue(0)
  const rotate = useSharedValue(0)

  
  const navigateToPost = (post_id: string) => {
    router.push(`(post)/${post_id}`);
  };

  const triggerMediumHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    if (likedPost?.includes(post_id)) {
      console.log('already liked');
    } else {
      await likeUpdate().finally(()=>{user && getLikedPost(user._id)})
    }
  };

  const triggerLightHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    console.log('Haptics triggered');
  };
  
  const oneTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(1)
    .onStart(()=>{
      runOnJS(triggerLightHaptics)();
    })
    .onEnd(() => {
      runOnJS(navigateToPost)(post_id);
    });
  
  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(()=>{
      runOnJS(triggerMediumHaptics)();
    })
    .onEnd(async () => {
      scale.value = withTiming(1.3, { duration: 400, easing: Easing.out(Easing.ease) })
      translateY.value = withTiming(-50, { duration: 300, easing: Easing.out(Easing.ease) }, () => {
        rotate.value = withTiming(15, { duration: 100, easing: Easing.out(Easing.ease) }, () => {
          rotate.value = withTiming(0, { duration: 100 })
        })
        translateY.value = withTiming(0, { duration: 200 })
        scale.value = withTiming(0, { duration: 300 })
      })
    });
  
  const tapGesture = Gesture.Exclusive(doubleTap, oneTap);

  const likeUpdate = async () => {
    if (!user?._id) return

    try {
      const response = await axios.put(`${SERVER_URL}/community/post/like?post_id=${post_id}&user_id=${user._id}`)

      if (response.data) {

        console.warn('Like :', response.data?.message)
      } else {
        console.warn('Like Failed:', response.data?.message)
      }
    } catch (error: any) {
      console.error('Like Error:', error?.response?.data || error.message)
    } finally {
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

  const likeAnimated = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` }
    ],
    opacity: scale.value > 0 ? 1 : 0,
  }));

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

  const [openDeleteModal,setOpenDeleteModal] = useState(false)
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const toggleOptions = () => { setOptionsVisible(!isOptionsVisible) };
  const closeOptions = () => { setOptionsVisible(false) };

  return (
    <GestureHandlerRootView style={{paddingHorizontal:14, width:'100%', borderBottomWidth:1, borderColor:colors.gray, paddingBottom:4}}>
    <View style={{backgroundColor:colors.background}} className=' flex-row gap-2 items-center justify-between'>

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

    {props.photo &&
      <GestureDetector gesture={tapGesture}>
        <Animated.View >
            {props.photo.length > 1? (
              <>
                <FlatList data={props.photo}
                  renderItem={({item}) =>
                    <View style={{width:screenWidth*0.93, height:screenWidth*0.93, padding:3, position:'relative' }}>
                      <SlideItem item={item} />
                    </View>
                  }
                  horizontal
                  pagingEnabled
                  snapToAlignment = "center"
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleOnScroll}
                  onViewableItemsChanged={handleOnViewableItemChanged}
                  viewabilityConfig={viewabilityConfig}
                />
                <PageNum currentIndex={index} total={props.photo.length}/>
                <Pagination data={props.photo} scrollX={scrollX}/>
              </>
            ):(
              <View style={{width:screenWidth*0.93, height:screenWidth*0.93, padding:3, position:'relative' }}>
                <View
                  style = {{ width : '100%',
                    height : '100%',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                    <Image
                      source={props.photo}
                      contentFit="cover"
                      style={{flex: 1, width:'100%', borderRadius: 15}}
                      transition={1000}
                    />
                </View>
              </View>
            )
            }
            <View style={{position:'absolute', width:'100%', height:'100%', alignItems:'center',justifyContent:'center'}}>
              <Animated.Image
                style={[styles.like, likeAnimated]}
                source={require('../../assets/icons/Like.png')}
              />
            </View>
        </Animated.View>
      </GestureDetector>
    }
    <TouchableWithoutFeedback onPress={()=>{router.push(`(post)/${post_id}`);}}>
      <Text
        style={{marginVertical:3, color:colors.text}} className='text-body font-noto line-clamp-2'
        numberOfLines={2}
        ellipsizeMode="tail"
      >
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
    <ConfirmDeleteModal
      isOpen={openDeleteModal}
      setIsOpen={setOpenDeleteModal}
      title='post'
      detail={'This will delete delete permanently. You cannot undo this action.'}
      handelDelete={deletePost}
      deleteType={'Delete'}
    />
  </GestureHandlerRootView>
  )
}

export default PostWithPhoto

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    width:screenWidth * 0.11,
    height:screenWidth * 0.11,
    alignContent:'center',
  },
  like: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    overflow: 'hidden',
    zIndex:100,
    justifyContent: 'center',
    alignItems: 'center',
  }
});