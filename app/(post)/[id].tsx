import { View, ViewToken, Text, NativeScrollEvent, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, RefreshControl, TouchableOpacity, Dimensions, StyleSheet, FlatList, Animated as ReactAnimated, NativeSyntheticEvent } from 'react-native'
import React, { useCallback, useState, useRef } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import BackButton from '../../components/Back';
import FollowButton from '../../components/Post/followButton';
import DisplayComment from '../../components/Post/displayComment';
import TextInputComment from '../../components/Post/textInputComment';
import { FlashList } from '@shopify/flash-list';
import { Comment, commentDummy } from '../../types/community';
import { useTheme } from '../../context/themeContext';
import { Image } from 'expo-image';
import { LikeIcon, OptionIcon, PenIcon } from '../../constants/icon'
import { router } from 'expo-router';
import { PostContent } from '../../types/community';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import SlideItem from '../../components/Post/slideItem';
import PageNum from '../../components/Post/pageNum';
import { TagCommunity } from '../../types/community';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { formatNumber } from '../../components/Post/postConstants';
import Pagination from '../../components/Post/pagination';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../context/authContext';
import LikeButton from '../../components/Post/likeButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModal } from '@gorhom/bottom-sheet/src';
import PostOptionBottomModal from '../../components/modal/PostEditModal';

const screenWidth = Dimensions.get('window').width;

const CommunityPost = () => {

  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user, likedPost, setLikedPost } = useAuth();

  const [postData, setPostData]= useState<PostContent | null>(null)
  const [commentData, setCommentData]= useState<Comment[] | null>(null)
  const [like, setLike] = useState<number | 0>(postData?.like || 0)

  const [refreshing, setRefreshing] = useState(false);
  const [isLoad, setIsLoad] = useState(true);

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

  const getPostDetail = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/community/post/${id}`);
      const data = response.data

      console.log('response post detail status 200 ok::\n');
      if ( data.message === "Post not found") {return }

      if (data) {
        setPostData({
          post_id:data.post_id,
          _id:data.create_by._id,
          username:data.create_by.username,
          profile_img:data.create_by.profile_img,
          date:data.date,
          content:data.content,
          tag:data.tag,
          like:data.like,
          comment:data.comment_count,
          photo:data.image,
        })

        const formattedComments: Comment[] = Array.isArray(data.comment)
        ? data.comment.map((c:any) => ({
            _id: c.create_by._id ?? '',
            username: c.create_by.username ?? 'Unknown',
            profile_img: c.create_by.profile_img ?? '',
            content: c.content ?? '',
            comment_date: c.comment_date ?? '',
          }))
        : [];

        setCommentData(formattedComments);
      } else {
        return
      }

    } catch (error: any){
      console.error('Get Post Error: ',error)
    }
  }


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getPostDetail().finally(()=>setRefreshing(false))
    }, 500);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoad(true)
      setTimeout(() => {
        getPostDetail().finally(()=>setIsLoad(false))
      }, 100);
    }, [])
  );

  const TagList = ({ tagId }: { tagId: number[] }) => {
    const { colors } = useTheme();
    const tags = TagCommunity.filter(tag => tagId.includes(tag.id));
  
    return (
      <View className="flex-row gap-1 my-1">
        {tags.map((tag) => (
          <TouchableOpacity key={tag.id} style={{ backgroundColor: colors.gray }} className="rounded-full p-1 px-2">
            <Text style={{ color: colors.subText }} className="text-detail font-noto">{tag.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const scale = useSharedValue(0)
  const translateY = useSharedValue(0)
  const rotate = useSharedValue(0)

  const triggerMediumHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    if (postData && likedPost?.includes(postData.post_id)) {
      console.log('already liked');
    } else {
      await likeUpdate().finally(()=>{user && getLikedPost(user._id)})
    }
  };

  const oneTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(1)
    .onEnd(() => {
      console.log('oneTap');
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
      const response = await axios.put(`${SERVER_URL}/community/post/like?post_id=${postData?.post_id}&user_id=${user._id}`)

      if (response.data) {
        console.warn('Like :', response.data?.message)
        response.data?.message === "Like post success" && setLike(like + 1);
        setPostData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            like: prev.like + 1,
          };
        });
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

  const [comment, setComment] = useState<string>('')

  const handleComment = async () => {
    console.log('send comment',comment );
    console.log('send comment post_id:',id );

    try {
      const response = await axios.post(`${SERVER_URL}/community/comment/create?post_id=${id}`, {
        content: comment,
        create_by: user?._id || '',
        comment_date: new Date(),
      });
      const data = response.data

      console.log('response comment \n',data);
      if ( data.message === "Post not found") {
        return console.log('Post not found to add comment');
      }

      if (data.message === "Create comment success") {
        setCommentData((prev) => [
          {
            _id: user?._id ?? '',
            username: user?.displayName ?? 'Unknown',
            profile_img: user?.photoURL ?? '',
            content: data.comment.content ?? '',
            comment_date: data.comment.comment_date ?? '',
          },
          ...(prev ?? [])
        ]);

        setComment('')
      } else {
        return
      }

    } catch (error: any){
      console.error('create comment Error: ',error)
    }
  }

  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const optionSheetModalRef = useRef<BottomSheetModal>(null);
  const handleOpenOption = (post_id: string) => {
    setSelectedPostId(post_id);
    optionSheetModalRef.current?.present();
  };

  return (
    <GestureHandlerRootView>
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center', position:'relative' }}
        keyboardVerticalOffset={2}
      >
        <View style={{width:"100%", height:'100%', alignItems:'center'}}>
        <View className='w-[92%] py-2'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/menu'}/>
          </View>
        </View>
        <ScrollView
          className='w-[96%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          // keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {!isLoad?(
            postData ? (
              <View className='mb-20'>
                <View style={{ backgroundColor: colors.background }} className='flex-row gap-2 items-center justify-between'>
                  <View className='my-2 items-center flex-row gap-2'>
                    <TouchableOpacity
                      onPress={() => router.dismissTo(`/community/user/${postData._id}`)}
                      activeOpacity={0.6}
                      style={{ borderColor: colors.gray }}
                      className='overflow-hidden rounded-full border border-gray'
                    >
                      <Image
                        style={styles.image}
                        source={postData.profile_img}
                        contentFit="cover"
                        transition={1000}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text style={{ color: colors.text }} className='text-heading3 font-noto'>{postData.username}</Text>
                      <Text style={{ color: colors.subText }} className='text-detail font-notoLight'>
                        {new Intl.DateTimeFormat('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              // hour: '2-digit',
                              // minute: '2-digit'
                            }).format(new Date(postData.date))}
                      </Text>
                    </View>
                  </View>
                  <View>
                  {user?._id === postData._id ? (
                      <TouchableOpacity onPress={()=>{handleOpenOption(postData.post_id)}} className="flex-row rounded-full p-1 px-2">
                        <OptionIcon width={24} height={24} color={colors.darkGray}/>
                      </TouchableOpacity>
                    ):(
                      <FollowButton userPostID={postData._id}/>
                    )}
                  </View>
                </View>
                <Text style={{ marginVertical:3, color: colors.text }} className='text-body font-noto ml-2'>{postData.content}</Text>
                <View className=" flex-row gap-1 my-2 ml-2">
                  <TagList tagId={postData.tag}/>
                </View>

                {postData.photo && postData.photo.length > 0 &&
                <GestureDetector gesture={tapGesture}>
                    <Animated.View>
                      {postData.photo.length > 1? (
                        <>
                          <FlatList
                            data={postData.photo}
                            renderItem={({ item }) => (
                              <View style={{ width: screenWidth * 0.96, height: screenWidth * 0.96, padding: 3, position: 'relative' }}>
                                <SlideItem item={{ uri: item }} />
                              </View>
                            )}
                            horizontal
                            pagingEnabled
                            snapToAlignment="center"
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleOnScroll}
                            onViewableItemsChanged={handleOnViewableItemChanged}
                            viewabilityConfig={viewabilityConfig}
                          />
                          <PageNum currentIndex={index} total={postData.photo.length} />
                          <Pagination data={postData.photo} scrollX={scrollX} />
                        </>
                      ):(
                        <View style={{width:screenWidth*0.96, height:screenWidth*0.96, padding:3, position:'relative' }}>
                          <View
                            style = {{ width : '100%',
                              height : '100%',
                              alignItems: 'center',
                              overflow: 'hidden',
                            }}
                          >
                            <Image
                              source={postData.photo}
                              contentFit="cover"
                              style={{flex: 1, width:'100%', borderRadius: 15}}
                              transition={1000}
                            />
                          </View>
                        </View>
                      )}
                      <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Animated.Image
                          style={[styles.like, likeAnimated]}
                          source={require('../../assets/icons/Like.png')}
                        />
                      </View>
                    </Animated.View>
                </GestureDetector>
                }


                <View className="items-center justify-end mb-1 pr-2 flex-row">
                  <View className='grow justify-end'>
                    <Text style={{color:colors.subText}} className='text-body font-noto ml-2'>{formatNumber(postData.comment)} comment</Text>
                  </View>
                  <LikeButton like={like} post_id={postData.post_id} setLike={setLike}/>
                  <Text style={{color:colors.subText}} className='ml-1 font-notoMedium'>like</Text>
                </View>


                <View style={{paddingHorizontal:14, borderColor:colors.gray}} className='w-full border-b mb-2 '/>
                {/* <Text style={{color:colors.subText}} className='text-body font-noto mb-2 ml-4'>{formatNumber(postData.comment)} comment</Text> */}
                {commentData? (
                  <FlashList
                    data={commentData}
                    renderItem={({ item }) =>
                      <DisplayComment
                        _id={item._id}
                        username={item.username}
                        profile_img={item.profile_img}
                        content={item.content}
                        comment_date={item.comment_date}
                      />
                    }
                    estimatedItemSize={200}
                  />
                ):(
                  <View className='flex-1 min-h-40 justify-center items-center'>
                    <Text style={{color:colors.subText}} className='text-heading3'>no comment</Text>
                  </View>
                )}
              </View>
            ):(
              <View className='flex-1 justify-center items-center'>
                <Text style={{color:colors.subText}} className='text-heading'>no post data</Text>
              </View>
            )
          ):(
            <View className='flex-1'>
              <View className='flex-row mt-3'>
                <View className='w-[60%] flex-row gap-2 items-center'>
                  <View style={{backgroundColor:colors.gray}} className='h-14 w-14 rounded-full'/>
                  <View style={{backgroundColor:colors.gray}} className='h-12 w-[50%] rounded-normal'/>
                </View>
                <View className='w-[40%] items-end justify-center'>
                  <View style={{backgroundColor:colors.gray}} className=' rounded-full w-[70%] h-10'/>
                </View>
              </View>
              <View>
                <View style={{width:screenWidth*0.96, height:screenWidth*0.25, backgroundColor:colors.gray }} className='mt-4 rounded-normal'/>
                <View style={{width:screenWidth*0.96, height:screenWidth*0.86, backgroundColor:colors.gray }} className='mt-4 rounded-normal'/>
              </View>
              <View>
                <View style={{width:screenWidth*0.96, height:screenWidth*0.15, backgroundColor:colors.gray }} className='mt-2 rounded-normal'/>
                <View style={{width:screenWidth*0.96, height:screenWidth*0.15, backgroundColor:colors.gray }} className='mt-2 rounded-normal'/>
              </View>
            </View>
          )}

        </ScrollView>
        <View style={{position:'absolute',backgroundColor:colors.background, borderColor:colors.gray}} className='bottom-0 left-0 pt-1 border-t w-full'>
          <TextInputComment comment={comment} setComment={setComment} submit={handleComment}/>
        </View>
        </View>
      </KeyboardAvoidingView>
      <PostOptionBottomModal ref={optionSheetModalRef} post_id={selectedPostId}/>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default CommunityPost

const styles = StyleSheet.create({
  image: {
    width: screenWidth * 0.11,
    height: screenWidth * 0.11,
    borderRadius: 50,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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