import { BottomSheetModal } from '@gorhom/bottom-sheet/src';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommentBottomModal from '../../../components/modal/CommentBottomModal';
import PostOnlyText from '../../../components/Post/postOnlyText';
import PostWithPhoto from '../../../components/Post/postWithPhoto';
import { BellIcon, GalleryIcon, PenIcon, SearchIcon } from '../../../constants/icon';
import { useAuth } from '../../../context/authContext';
import { useTheme } from '../../../context/themeContext';
import { PostContent, postDummy } from '../../../types/community';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { AllTag, SelectTagList } from '../../../components/Post/postConstants';
import PostOptionBottomModal from '../../../components/modal/PostEditModal';


const screenWidth = Dimensions.get('window').width;

const HEADER_HEIGHT = 180;
const SCROLL_UP_THRESHOLD = 60;
const SCROLL_DOWN_THRESHOLD = 60;

const CommunityFeed = () => {

  const { colors } = useTheme();
  const { user, userFollow } = useAuth()

  const [refreshing, setRefreshing] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [postList, setPostList] = useState<PostContent[] | null>(null)
  const [page, setPage] = useState(1);

  const insets = useSafeAreaInsets();
  const scrollYRef = useRef(0)
  const scrollBuffer = useRef(0);
  const top = useSharedValue(0)
  const [headerHeight, setHeaderHeight] = useState(0)

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: withSpring(top.value - 50, { damping: 30, stiffness: 300 }) 
    }]
  }));

  const handleScroll = (e:any) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    const scrollDirection = scrollY - scrollYRef.current;

    const scrollingDown = scrollY > scrollYRef.current;

    if (scrollY <= 0) {
      top.value = 0;
    }
    else if (scrollDirection > 0 && scrollDirection < 200) {
      top.value = Math.max(-HEADER_HEIGHT, top.value - scrollDirection);
    }
    
    if (scrollingDown) {
      // Increment the scroll buffer when scrolling down
      scrollBuffer.current += scrollY - scrollYRef.current;

      if (scrollBuffer.current > SCROLL_DOWN_THRESHOLD) {
        // Hide the header only after exceeding the down threshold
        top.value = withSpring(-HEADER_HEIGHT, { damping: 16, stiffness: 120 });
        scrollBuffer.current = 0; // Reset the buffer after hiding the header
      }
    } else {
      // Increment the scroll buffer when scrolling up
      scrollBuffer.current += scrollYRef.current - scrollY;

      if (scrollBuffer.current > SCROLL_UP_THRESHOLD) {
        // Show the header only after exceeding the up threshold
        top.value = withSpring(0, { damping: 16, stiffness: 120 });
        scrollBuffer.current = 0; // Reset the buffer after showing the header
      }
    }

    scrollYRef.current = scrollY;
  };

  const [interestTag, setInterestTag] = useState<number[] | null >(null)
  const tagInPost = (postList:PostContent[]) => {
    const tagSet: Set<number> = new Set();
  
    postList?.forEach((item: PostContent) => {
      item.tag.forEach((num: number) => {
        tagSet.add(num)
      });
    });
  
    return Array.from(tagSet)
  };

  const getFeed = async (pageNum = 1) => {
    console.log('get feed pageNum',pageNum);
    
    try {
      const response = await axios.get(`${SERVER_URL}/community/post/feed/${user?._id}`,{
        params: {
          page: pageNum,
          limit: 6,
        },
      });
      const data = response.data

      if ( data.message === "User not found") {return console.error('User not found')}

      if (data.length === 0) {
        setPage(page-1)
        return
      }

      if (data) {
        const formattedData: PostContent[] = data.map((post: any) => ({
          post_id: post.post_id,
          date: post.date,
          content: post.content,
          tag: post.tag,
          like: post.like,
          comment: post.comment,
          photo: post.image,
          _id: post.create_by._id,
          username: post.create_by.username,
          profile_img: post.create_by.profile_img,
        }));

        setPostList(prev => (pageNum === 1 ? formattedData : [...(prev || []), ...formattedData]));

        if (pageNum === 1) {
          const tagList = tagInPost(formattedData);
          setInterestTag(tagList);
        }

      } else {
        return
      }

    } catch (error: any){
      console.error('Get Post Error: ',error)
    }
  }

  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const loadMore = async () => {
    
    if (isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    const nextPage = page + 1;
    await getFeed(nextPage);
    setPage(nextPage);
    setIsFetchingNextPage(false);
  }

  const onRefresh = useCallback(() => {
    setPage(1)
    setRefreshing(true);
    setTimeout(() => {
      getFeed(1).finally(()=>setRefreshing(false));
    }, 200);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (postList === null) {
        setIsLoad(true)
        getFeed(1).finally(() => setIsLoad(false));
      }
    }, [])
  );

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const handleOpenPress = (post_id: string) => {
    setSelectedPostId(post_id);
    bottomSheetModalRef.current?.present();
  };

  const optionSheetModalRef = useRef<BottomSheetModal>(null);
  const handleOpenOption = (post_id: string) => {
    setSelectedPostId(post_id);
    optionSheetModalRef.current?.present();
  };

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className=" relative w-full h-full justify-center items-center font-noto">
      <View style={{position:'relative', left:0, width:'100%', backgroundColor:colors.background}} className=' z-10'>
      <Animated.View
        onLayout={(e)=> setHeaderHeight(e.nativeEvent.layout.height)}
        style={[
          headerStyle,
          {
            // height: HEADER_HEIGHT,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1,
            paddingTop: 50,
            backgroundColor:colors.background
          },
        ]}
        className='w-full items-center justify-center'
      >
        <View className='w-[92%] flex-row gap-2 justify-start items-center mt-1'>
          <View className='flex grow'>
            <Text className='text-primary font-notoSemiBold text-subTitle'>Better Me</Text>
          </View>
          
          <TouchableOpacity activeOpacity={0.6} onPress={()=>{router.push('/community/search')}} className='p-[6px] rounded-full bg-primary'>
            <SearchIcon width={24} height={24} color={'white'}/>
          </TouchableOpacity>
        </View>
        <View style={{borderColor:colors.gray}} className='w-full items-center border-b pb-2'>
          <View className='w-[92%] mt-1 flex-row gap-2 justify-start items-center'>
            <TouchableOpacity activeOpacity={0.6} onPress={()=>{router.push('/community/userProfile')}} className='overflow-hidden rounded-full border border-gray'>
              <Image
                style={styles.image}
                source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
                contentFit="cover"
                transition={1000}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} onPress={()=>{router.push('/(post)/postCreate')}} className='grow flex-row items-center rounded-full border border-primary p-2 px-4'>
              <View style={{ transform: [{ translateY: 1 }], }} className='mr-auto'>
                <Text style={{color:colors.subText}} className='font-noto'>What are you doing?</Text>
              </View>
              <PenIcon width={24} height={24} color={colors.primary}/>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      </View>

        <View className="flex-1 flex flex-col gap-2 items-center w-full">
          {!isLoad?(
            postList?(
              <View className='w-full h-full'>
                <FlashList
                  data={postList}
                  renderItem={({ item }) => (
                    item.photo?.length !== 0? (
                      <PostWithPhoto
                        _id={item._id}
                        username={item.username}
                        profile_img={item.profile_img}
                        post_id={item.post_id}
                        date={item.date}
                        content={item.content}
                        tag={item.tag}
                        like={item.like}
                        comment={item.comment}
                        photo={item.photo}
                        openComment={handleOpenPress}
                        openOption={handleOpenOption}
                      />
                    ):(
                      <PostOnlyText
                        _id={item._id}
                        username={item.username}
                        profile_img={item.profile_img}
                        post_id={item.post_id}
                        date={item.date}
                        content={item.content}
                        tag={item.tag}
                        like={item.like}
                        comment={item.comment}
                        openComment={handleOpenPress}
                        openOption={handleOpenOption}
                      />
                    )
                  )
                  }
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={
                    <>
                      <View style={{ height: headerHeight - 50  }} />
                      {interestTag && <TagSection tagList={interestTag} />}
                    </>
                  }
                  onEndReached={loadMore}
                  onEndReachedThreshold={0.2}
                  ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
                  estimatedItemSize={1000}
                  onLoad={({ elapsedTimeInMs }) => {
                    console.log(`FlashList loaded in ${elapsedTimeInMs}ms`);
                  }}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
              </View>
            ):(
              <View className='flex-1 justify-center items-center'>
                <Text style={{color:colors.subText}} className='text-heading2'>No post</Text>
              </View>
            )
          ):(
            <View className='flex-1 w-[92%]'>
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
                <View style={{width:screenWidth*0.92, height:screenWidth*0.86, backgroundColor:colors.gray }} className='mt-2 rounded-normal'/>
                <View style={{width:screenWidth*0.92, height:screenWidth*0.20, backgroundColor:colors.gray }} className='mt-2 rounded-normal'/>
              </View>
              <View className='flex-row justify-between'>
                <View style={{width:'30%', height:screenWidth*0.1, backgroundColor:colors.gray }} className='mt-2 rounded-normal'/>
                <View style={{width:'50%', height:screenWidth*0.1, backgroundColor:colors.gray }} className='mt-2 rounded-normal'/>
              </View>
            </View>
          )}
            
        </View>

      <View style={{ position:'absolute', top:0, left:0, right:0, height: insets.top, zIndex:100, backgroundColor:colors.background }} />
      <CommentBottomModal ref={bottomSheetModalRef} post_id={selectedPostId} postList={postList} setPostList={setPostList}/>
      <PostOptionBottomModal ref={optionSheetModalRef} post_id={selectedPostId}/>
      </SafeAreaView>
  )
}

export const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    width:screenWidth * 0.11,
    height:screenWidth * 0.11,
    alignContent:'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    borderRadius: 99,
    fontSize: 16,
    lineHeight: 20,
    padding:10,
    borderWidth:1,
    borderColor:'#e8e8e8',
    backgroundColor: 'white',
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#80f',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
});

interface TagSectionProps {
  tagList: number[];
}

const TagSection: React.FC<TagSectionProps> = ({ tagList }) => {
  const { colors } = useTheme();
  const top = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: top.value >= 0 ? 1 : 0,
      transform: [
        {
          translateY: withSpring(top.value >= 0 ? 0 : -20),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        { width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 8, borderColor:colors.gray },
      ]}
      className="border-b pb-2"
    >
      <View className="w-[92%]">
        <Text style={{color:colors.subText}} className="text-detail text-subText">interest this tag?</Text>
      </View>
      <View className="w-full items-start mt-2 flex-row gap-2 pl-2">
        <SelectTagList tagFilter={tagList}/>
      </View>
    </Animated.View>
  );
}

export default CommunityFeed