import {Animated,FlatList, View, Text,TouchableOpacity, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ViewToken} from 'react-native'
import React, {useRef, useState} from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon } from '../../constants/icon'
import SlideItem from './slideItem'
import Paginaion from './pagination'
import PageNum from './pageNum';


const screenWidth = Dimensions.get('window').width;

const PostWithPhoto = () => {

  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event([
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




  return (
    <View style={{paddingHorizontal:14}} className='w-full border-b pb-2 border-gray '>
      
    <View className=' flex-row gap-2 items-center justify-between bg-Background '>

    <View className='my-2 items-center flex-row gap-2'>
        <TouchableOpacity activeOpacity={0.6}  className='overflow-hidden rounded-full border border-gray'>
          <Image
          style={styles.image}
          source={require('../../assets/maleAvatar.png')}
          contentFit="cover"
          transition={1000}/>
        </TouchableOpacity>
        <View>
        <Text className='text-heading3 font-noto'>Mr.Armstrong</Text>
        <Text className='text-detail font-notoLight'>11 may 2024</Text>
        </View>

    </View>
      <TouchableOpacity className="flex-row rounded-full bg-gray p-1 px-2">
        <Text className="text-subText font-noto px-4 ">following</Text>
      </TouchableOpacity>
    </View>


    <View>
      
      <FlatList data={Slides}
        renderItem={({item}) => 
        <View style={{width:screenWidth*0.93, height:screenWidth*0.93, padding:3 }}>
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
      <PageNum currentIndex={index} total={Slides.length}/>
      <Paginaion data={Slides} scrollX={scrollX}/>
    </View>

    <Text
      style={{marginVertical:3}} className='text-body font-noto line-clamp-2'
      numberOfLines={2}
      ellipsizeMode="tail"
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore animi dolorum vel voluptatum amet quae assumenda sit quibusdam dignissimos, vero ut quisquam blanditiis repellendus placeat, deserunt in cupiditate esse voluptatem?
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

  </View>

  
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
});