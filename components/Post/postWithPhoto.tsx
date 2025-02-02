import {Animated,FlatList, View, Text,TouchableOpacity, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ViewToken} from 'react-native'
import React, {useRef, useState} from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon } from '../../constants/icon'
import SlideItem from '../../components/Post/slideItem'
import Parginaion from '../../components/Post/pagination'

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
    <View style={{paddingHorizontal:14, backgroundColor:'white'}} className='w-full  '>
      
    <View className=' flex-row gap-2 items-center justify-between '>

    <View className='my-2 items-center flex-row gap-2'>
        <TouchableOpacity activeOpacity={0.6}  className='overflow-hidden rounded-full border border-gray'>
          <Image
          style={styles.image}
          source={('../../../assets/maleAvatar.png')}
          contentFit="cover"
          transition={1000}/>
        </TouchableOpacity>
        <View>
        <Text className='text-heading3 font-noto'>Mr.Armstrong</Text>
        <Text className='text-subtext text-detail font-notoLight'>11 may 2024</Text>
        </View>

    </View>
      <TouchableOpacity className="flex-row rounded-full bg-gray p-1 px-2">
        <Text className="text-subtext font-noto px-4 ">following</Text>
      </TouchableOpacity>
    </View>

    <View>
      <FlatList data={Slides} 
      renderItem={({item}) => <SlideItem item={item} /> }
      horizontal
      pagingEnabled
      snapToAlignment = "center"
      showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemChanged}
        viewabilityConfig={viewabilityConfig}
       />
       <Parginaion data={Slides} scrollX={scrollX}/>
    </View>

 
    <Text className='text-body font-noto'>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Error, numquam
    </Text>


    <View className="mt-2 flex-row gap-2 items-center justify-between">
    <View className=" flex-row gap-1">
            <TouchableOpacity className="rounded-full bg-gray p-1 px-2">
              <Text className="text-subtext text-detail font-noto">exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-gray p-1 px-2">
              <Text className="text-subtext text-detail font-noto ">fitness</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-gray p-1 px-2">
              <Text className="text-subtext text-detail font-noto">+2</Text>
            </TouchableOpacity>
          </View>

        <View className=" items-end flex-row gap-2 items-center">
          <TouchableOpacity className=" flex-row gap-1 items-center">
            <LikeIcon width={20} color={'#CFCFCF'}/>
            <Text className='text-detail font-noto'>123k</Text>
          </TouchableOpacity>
          <TouchableOpacity className=" flex-row gap-1 items-center">
            <CommentIcon width={20} color={'#CFCFCF'}/>
            <Text className='text-detail font-noto'>567k</Text>
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