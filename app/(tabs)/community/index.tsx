import { View, Text, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Button } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '../../../context/authContext';
import { AddIcon, BellIcon, GalleryIcon, PenIcon, SearchIcon, UserIcon } from '../../../constants/icon';
import { FlashList } from '@shopify/flash-list';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PostOnlyText from '../../../components/Post/postOnlyText';
import PostWithPhoto from '../../../components/Post/postWithPhoto';
import { postDummy } from '../../../types/community';
import { colors, useTheme } from '../../../context/themeContext';
import CommentBottomModal from '../../../components/modal/CommentBottomModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetFooter, BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput, BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet/src';

const screenWidth = Dimensions.get('window').width;

const HEADER_HEIGHT = 180;
const SCROLL_UP_THRESHOLD = 60;
const SCROLL_DOWN_THRESHOLD = 60;

const CommunityFeed = () => {

  const { colors } = useTheme();
  const { user } = useAuth()

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('refreshing ');
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const [postList, setPostList] = useState<number[]>([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])

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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { dismiss } = useBottomSheetModal();

  const handleOpenPress = () => {
    console.log('handleOpenPress ');
    bottomSheetModalRef.current?.present();
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
          
          <View className=' relative'>
            <TouchableOpacity activeOpacity={0.6} onPress={()=>{router.push('/community/search')}} className='p-[6px] rounded-full bg-primary'>
              <BellIcon width={24} height={24} color={'white'}/>
            </TouchableOpacity>
            <View className='h-3 w-3 absolute right-0 top-0 rounded-full bg-red'/>
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
            <TouchableOpacity activeOpacity={0.6} onPress={()=>{router.push('/community/post/create')}} className='grow flex-row items-center rounded-full border border-primary p-2 px-4'>
              <View style={{ transform: [{ translateY: 1 }], }} className='mr-auto'>
                <Text style={{color:colors.subText}} className='font-noto'>What are you doing?</Text>
              </View>
              <PenIcon width={24} height={24} color={colors.nonFocus}/>
            </TouchableOpacity>
            <GalleryIcon width={30} height={30} color={colors.nonFocus}/>
          </View>
        </View>
      </Animated.View>
      </View>



      <ScrollView
        className='w-full h-auto relative'
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingTop:0, marginTop:headerHeight - 50}}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode='on-drag'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {refreshing &&
          <View className="flex-1 justify-center items-center bg-primaryblue-300">
            <View className="flex-row space-x-2">
              <ActivityIndicator size="large" />
            </View>
          </View>
        }
        <TagSection/>

        {/* test to post */}
        <PenIcon width={24} height={24} color={colors.nonFocus} onPress={()=>{router.push('/community/post/id')}}/>

        <View className="flex-1 mb-4 mt-1 flex flex-col gap-2 items-center w-full pb-5">

            {postList.length != 0 ? (
              <View className='w-full'>
                <FlashList
                  data={postDummy}
                  renderItem={({ item }) => (
                    item.photo? (
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
                      />
                    ):(
                      <PostOnlyText/>
                    )
                  )
                  }
                  estimatedItemSize={200}
                />
              </View>
            ):(
              <View>
                <Text style={{color:colors.subText}}>No post</Text>
              </View>
            )
            }

        </View>
      </ScrollView>

      <View style={{ position:'absolute', top:0, left:0, right:0, height: insets.top, zIndex:100, backgroundColor:colors.background }} />
        <CommentBottomModal ref={bottomSheetModalRef} />
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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


const TagSection:React.FC = () => {
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
      <View className="w-[92%] items-start mt-2 flex-row gap-2">
        <TouchableOpacity className="flex-row rounded-full bg-primary p-1 px-4">
          <Text className="text-white font-notoMedium text-detail">clean food</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row rounded-full bg-primary p-1 px-4">
          <Text className="text-white font-notoMedium text-detail">weight training</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default CommunityFeed