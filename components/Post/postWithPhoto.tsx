import {Animated as ReactAnimated, FlatList, View, Text,TouchableOpacity, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ViewToken, TouchableWithoutFeedback} from 'react-native'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon, OptionIcon } from '../../constants/icon'
import SlideItem from './slideItem'
import PageNum from './pageNum';
import { Gesture, GestureDetector, GestureHandlerRootView, } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { PostContent, TagCommunity } from '../../types/community';
import { useAuth } from '../../context/authContext';
import { router } from 'expo-router';
import { useTheme } from '../../context/themeContext';
import CommentBottomModal from '../modal/CommentBottomModal';
import FollowButton from './followButton';
import { FlashList } from '@shopify/flash-list';
import { formatNumber, TagList } from './postConstants';
import { format } from 'date-fns';
import Pagination from './pagination';

const screenWidth = Dimensions.get('window').width;

type PostWithPhotoProp = {
  openComment : () => void
}

const PostWithPhoto = ({ openComment, post_id, ...props }: PostContent & PostWithPhotoProp) => {

  const { colors } = useTheme();
  const { user } = useAuth()
  

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
  
  const scale = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .maxDuration(150)
    .numberOfTaps(2)
    .onStart(() => {
      console.log('Double tap!');
      
      scale.value = withSpring(1.2, undefined, (isFinished) => {
        if (isFinished) {
          scale.value = withDelay(100, withSpring(0));
        }
      });
  });

  const likeAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value > 0 ? 1 : 0,
  }));

  return (
    <GestureHandlerRootView style={{paddingHorizontal:14, width:'100%', borderBottomWidth:1, borderColor:colors.gray, paddingBottom:4}}>
      
    <View style={{backgroundColor:colors.background}} className=' flex-row gap-2 items-center justify-between'>

      <View className='my-2 items-center flex-row gap-2'>
        <TouchableOpacity onPress={()=>{router.push(`/community/user/${props._id}`)}} activeOpacity={0.6} style={{borderColor:colors.gray}}  className='overflow-hidden rounded-full border border-gray'>
          <Image
            style={styles.image}
            source={props.profile_img}
            contentFit="cover"
            transition={1000}
          />
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

    {props.photo &&
      <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
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
    <TouchableWithoutFeedback onPress={()=>{router.push(`/community/post/${post_id}`)}}>
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
        <TouchableOpacity className=" flex-row gap-1 items-center">
          <LikeIcon width={26} height={26} color={colors.darkGray}/>
          <Text style={{color:colors.subText}} className='text-body font-noto'>
            {formatNumber(props.like)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openComment} className=" flex-row gap-1 items-center">
          <CommentIcon width={26} height={26}color={colors.darkGray}/>
          <Text style={{color:colors.subText}} className='text-body font-noto'>
            {formatNumber(props.comment)}
          </Text>
        </TouchableOpacity>
      </View>

      <TagList tagId={props.tag}/>
    </View>
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