import {Animated as ReactAnimated, FlatList, View, Text,TouchableOpacity, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ViewToken} from 'react-native'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon } from '../../constants/icon'
import SlideItem from './slideItem'
import Paginaion from './pagination'
import PageNum from './pageNum';
import { Gesture, GestureDetector, GestureHandlerRootView, } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { PostContent } from '../../types/community';

const screenWidth = Dimensions.get('window').width;

const PostWithPhoto = (props:PostContent) => {
  
  useEffect(()=>{
    console.log(props);
  },[props])
  

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


  const Slides = [
    {
      id: 1,
      img: require('../../assets/dummyPhoto/BigMeal.jpg')
  },
  {
      id: 2,
      img: require('../../assets/dummyPhoto/Breakfast.jpg')
  },
  {
      id: 3,
      img: require('../../assets/dummyPhoto/Salmon.jpg')
  },
  {
      id: 4,
      img: require('../../assets/dummyPhoto/ShrimpBroc.jpg')
  },
  {
      id: 5,
      img: require('../../assets/dummyPhoto/ShrimpBroc.jpg')
  }
  ]
  

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
    <GestureHandlerRootView style={{paddingHorizontal:14, width:'100%', borderBottomWidth:1, borderColor:'#e8e8e8', paddingBottom:4}}>
      
    <View className=' flex-row gap-2 items-center justify-between bg-Background '>

    <View className='my-2 items-center flex-row gap-2'>
        <TouchableOpacity activeOpacity={0.6}  className='overflow-hidden rounded-full border border-gray'>
          <Image
          style={styles.image}
          source={props.profile_img}
          contentFit="cover"
          transition={1000}/>
        </TouchableOpacity>
        <View>
        <Text className='text-heading3 font-noto'>{props.username}</Text>
        <Text className='text-detail font-notoLight'>11 may 2024</Text>
        </View>

    </View>
      <TouchableOpacity className="flex-row rounded-full bg-gray p-1 px-2">
        <Text className="text-subText font-noto px-4 ">following</Text>
      </TouchableOpacity>
    </View>

    {props.photo &&
      <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
      <View>
      
        <Animated.View >
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
          <Paginaion data={props.photo} scrollX={scrollX}/>
          <View style={{position:'absolute', width:'100%', height:'100%', alignItems:'center',justifyContent:'center'}}>
            <Animated.Image
              style={[styles.like, likeAnimated]}
              source={require('../../assets/icons/Like.png')}
              />
          </View>
        </Animated.View>
      </View>
      </GestureDetector>
    }

    <Text
      style={{marginVertical:3}} className='text-body font-noto line-clamp-2'
      numberOfLines={2}
      ellipsizeMode="tail"
    >
      {props.content}
    </Text>

    <View className="mt-2 flex-row gap-2 items-center justify-between">
      <View style={{gap:14}} className=" items-end flex-row bg-rose-200">
        <TouchableOpacity className=" flex-row gap-1 items-center">
          <LikeIcon width={26} height={26} color={'#CFCFCF'}/>
          <Text className='text-body font-noto'>123k</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" flex-row gap-1 items-center">
          <CommentIcon width={26} height={26}color={'#CFCFCF'}/>
          <Text className='text-body font-noto'>567k</Text>
        </TouchableOpacity>
      </View>

      <View className=" flex-row gap-1">
          <TouchableOpacity className="rounded-full bg-gray p-1 px-2">
            <Text className="text-subText text-detail font-noto">exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-full bg-gray p-1 px-2">
            <Text className="text-subText text-detail font-noto ">fitness</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-full bg-gray p-1 px-2">
            <Text className="text-subText text-detail font-noto">+2</Text>
          </TouchableOpacity>
      </View>
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