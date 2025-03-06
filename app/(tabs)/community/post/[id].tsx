import { View, ViewToken, Text, NativeScrollEvent, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, RefreshControl, TouchableOpacity, Dimensions, StyleSheet, FlatList, Animated as ReactAnimated, NativeSyntheticEvent } from 'react-native'
import React, { useCallback, useState, useRef } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import BackButton from '../../../../components/Back';
import FollowButton from '../../../../components/Post/followButton';
import DisplayComment from '../../../../components/Post/displayComment';
import TextInputComment from '../../../../components/Post/textInputComment';
import { FlashList } from '@shopify/flash-list';
import { Comment, commentDummy } from '../../../../types/community';
import { useTheme } from '../../../../context/themeContext';
import { Image } from 'expo-image';
import { LikeIcon } from '../../../../constants/icon'
import { router } from 'expo-router';
import { PostContent } from '../../../../types/community';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import SlideItem from '../../../../components/Post/slideItem';
import PageNum from '../../../../components/Post/pageNum';
import { TagCommunity } from '../../../../types/community';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { formatNumber } from '../../../../components/Post/postConstants';
import Pagination from '../../../../components/Post/pagination';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';


const screenWidth = Dimensions.get('window').width;

const CommunityPost = ({ post_id }: PostContent) => {

  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const scale = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);

  // const [postData, setPostData]= useState<PostContent>({
  //   _id:'string',
  //   username:'Alex Kim',
  //   date:'2025-02-04T05:54:45.558+00:00',
  //   profile_img:'https://picsum.photos/270',
  //   post_id:'wj54knwgeavi89q45ui3gv',
  //   content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
  //   tag:[1,4,5,7],
  //   like:4123,
  //   comment:1345,
  //   photo:['https://picsum.photos/280'],
  // })

  const [postData, setPostData]= useState<PostContent | null>(null)
  const [commentData, setCommentData]= useState<Comment[] | null>(null)

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

      console.log('response post detail \n',data);
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
      getPostDetail()
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
    <GestureHandlerRootView>
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <View className='w-[92%]'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/menu'}/>
          </View>
        </View>
        <ScrollView
          className='w-[96%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {postData ? (
            <View className='mb-10'>
              <View style={{ backgroundColor: colors.background }} className='flex-row gap-2 items-center justify-between'>
                <View className='my-2 items-center flex-row gap-2'>
                  <TouchableOpacity 
                    onPress={() => router.push(`/community/user/${post_id}`)}
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
                <View className='mb-4'>
                  <FollowButton userPostID={postData._id}/>
                </View>
              </View>
              <Text style={{ marginVertical:3, color: colors.text }} className='text-body font-noto ml-2'>{postData.content}</Text>
              <View className=" flex-row gap-1 my-2 ml-2">
                <TagList tagId={postData.tag}/>
              </View>

              {postData.photo && postData.photo.length > 0 &&
              <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
                <View>
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
                        source={require('../../../../assets/icons/Like.png')}
                      />
                    </View>
                  </Animated.View>
                </View>
              </GestureDetector>
              }


              <View className=" items-end mb-2">
                <TouchableOpacity className=" flex-row gap-1 items-center">
                  <LikeIcon width={26} height={26} color={colors.darkGray}/>
                  <Text style={{color:colors.subText}} className='text-body font-noto'>{formatNumber(postData.like)}</Text>
                </TouchableOpacity>
              </View>


              <View style={{paddingHorizontal:14, borderColor:colors.gray}} className='w-full border-b mb-2 '/>
              <Text style={{color:colors.subText}} className='text-body font-noto mb-2 ml-4'>{formatNumber(postData.comment)} comment</Text>
              <TextInputComment/>
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
          )}

        </ScrollView>
      </KeyboardAvoidingView>
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