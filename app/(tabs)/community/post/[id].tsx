import { View, ViewToken, Text, NativeScrollEvent, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, RefreshControl, TouchableOpacity, Dimensions, StyleSheet, FlatList, Animated as ReactAnimated, NativeSyntheticEvent } from 'react-native'
import React, { useCallback, useState, useRef } from 'react'
import { useLocalSearchParams } from 'expo-router';
import BackButton from '../../../../components/Back';
import FollowButton from '../../../../components/Post/followButton';
import DisplayComment from '../../../../components/Post/displayComment';
import TextInputComment from '../../../../components/Post/textInputComment';
import { FlashList } from '@shopify/flash-list';
import { postDummy } from '../../../../types/community';
import { useTheme } from '../../../../context/themeContext';
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon } from '../../../../constants/icon'
import { router } from 'expo-router';
import { PostContent } from '../../../../types/community';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import SlideItem from '../../../../components/Post/slideItem';
import PageNum from '../../../../components/Post/pageNum';
import Paginaion from '../../../../components/Post/pagination';


const screenWidth = Dimensions.get('window').width;

const CommunityPost = ({   post_id }: PostContent) => {

  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const scale = useSharedValue(0);
  
  
  const [data, setData]= useState<PostContent>({
    _id:'string',
    username:'Alex Kim',
    date:'2025-02-04T05:54:45.558+00:00',
    profile_img:'https://picsum.photos/270',
    post_id:'wj54knwgeavi89q45ui3gv',
    content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
    tag:[1,4,5,7],
    like:4123,
    comment:1345,
    photo:['https://picsum.photos/400','https://picsum.photos/410','https://picsum.photos/420','https://picsum.photos/430','https://picsum.photos/440','https://picsum.photos/450','https://picsum.photos/460','https://picsum.photos/470','https://picsum.photos/480','https://picsum.photos/490'],
  })

  const Slides = [ require('../../../../assets/dummyPhoto/BigMeal.jpg'), require('../../../../assets/dummyPhoto/Breakfast.jpg'), require('../../../../assets/dummyPhoto/Salmon.jpg'), require('../../../../assets/dummyPhoto/ShrimpBroc.jpg'),require('../../../../assets/dummyPhoto/ShrimpBroc.jpg')]
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

      const likeAnimated = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
          opacity: scale.value > 0 ? 1 : 0,
        }));
  
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
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
          {data.photo.length != 0 && 
            <View>      
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
                      source={data.profile_img}
                      contentFit="cover"
                      transition={1000}
                    />
                  </TouchableOpacity>
                  <View>
                    <Text style={{ color: colors.text }} className='text-heading3 font-noto'>{data.username}</Text>
                    <Text style={{ color: colors.subText }} className='text-detail font-notoLight'>{data.date}</Text>
                  </View>
                </View>
                <View className='mb-4'>
                  <FollowButton />
                </View>
              </View>
              <Text style={{ marginVertical:3, color: colors.text }} className='text-body font-noto ml-2'>{data.content}</Text>
              <View className=" flex-row gap-1 my-2 ml-2">
                <TouchableOpacity style={{backgroundColor:colors.gray}} className="rounded-full p-1 px-2">
                  <Text style={{color:colors.subText}} className=" text-detail font-noto">exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:colors.gray}} className="rounded-full p-1 px-2">
                  <Text style={{color:colors.subText}} className=" text-detail font-noto ">fitness</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:colors.gray}} className="rounded-full p-1 px-2">
                  <Text style={{color:colors.subText}} className=" text-detail font-noto">+2</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Animated.View>
                  <FlatList 
                    data={data.photo}
                    renderItem={({ item }) => (
                      <View style={{ width: screenWidth * 0.93, height: screenWidth * 0.93, padding: 3, position: 'relative' }}>
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
                  <PageNum currentIndex={index} total={data.photo.length} />
                  <Paginaion data={data.photo} scrollX={scrollX} />
                  <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Animated.Image
                      style={[styles.like, likeAnimated]}
                      source={require('../../../../assets/icons/Like.png')}
                    />
                  </View>
                </Animated.View>
              </View>
              <View className=" items-end mb-2">
                <TouchableOpacity className=" flex-row gap-1 items-center">
                  <LikeIcon width={26} height={26} color={colors.darkGray}/>
                  <Text style={{color:colors.subText}} className='text-body font-noto'>{data.like}</Text>
                </TouchableOpacity>
              </View>
              <View style={{paddingHorizontal:14, borderColor:colors.gray}} className='w-full border-b mb-2 '></View>
              <Text style={{color:colors.text}} className='text-detail font-noto mb-2 ml-4'>{data.comment} comment</Text>
              <TextInputComment/>
              <FlashList
                data={postDummy}
                renderItem={({ item }) =>
                <DisplayComment
                  _id={item._id}
                  username={item.username}
                  profile_img={item.profile_img}
                  content={item.content}
                />
                }
                estimatedItemSize={200}
              />
            </View>}       
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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