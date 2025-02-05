import { View, Text,TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon } from '../../constants/icon'

const PostOnlyText = () => {

  const screenWidth = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    image: {
      justifyContent: 'center',
      width:screenWidth * 0.11,
      height:screenWidth * 0.11,
      alignContent:'center',
    },
  });


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
        <Text className='text-heading3 font-noto'>Bro Motivation</Text>
        <Text className='text-detail font-notoLight'>23 may 2024</Text>
        </View>

    </View>
      <TouchableOpacity className="flex-row rounded-full bg-gray p-1 px-2">
        <Text className="text-subText font-noto px-4 ">following</Text>
      </TouchableOpacity>
    </View>

    <Text className='text-body font-noto'>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Error, numquam, asperiores quasi nemo nisi totam reprehenderit saepe, tenetur ut deleniti facere rerum ex soluta provident minus vel. Eius, 
      aut inventore!
    </Text>


    <View className="mt-2 flex-row gap-2 items-center justify-between">
        <View style={{gap:14}} className=" items-end flex-row bg-rose-200">
          <TouchableOpacity className=" flex-row gap-1 items-center">
            <LikeIcon width={25} height={25} color={'#CFCFCF'}/>
            <Text className='text-body font-noto'>123k</Text>
          </TouchableOpacity>
          <TouchableOpacity className=" flex-row gap-1 items-center">
            <CommentIcon width={25} height={25}color={'#CFCFCF'}/>
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

export default PostOnlyText