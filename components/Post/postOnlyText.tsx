import { View, Text,TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon } from '../../constants/icon'
import { useTheme } from '../../context/themeContext';

const PostOnlyText = () => {

  const { colors } = useTheme();
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
    <View style={{paddingHorizontal:14, borderColor:colors.gray}} className='w-full border-b pb-2 '>
      
    <View style={{backgroundColor:colors.background}} className=' flex-row gap-2 items-center justify-between '>

    <View className='my-2 items-center flex-row gap-2'>
        <TouchableOpacity activeOpacity={0.6} style={{borderColor:colors.gray}}  className='overflow-hidden rounded-full border'>
          <Image
          style={styles.image}
          source={require('../../assets/maleAvatar.png')}
          contentFit="cover"
          transition={1000}/>
        </TouchableOpacity>
        <View>
        <Text style={{color:colors.text}} className='text-heading3 font-noto'>Bro Motivation</Text>
        <Text style={{color:colors.subText}} className='text-detail font-notoLight'>23 may 2024</Text>
        </View>

    </View>
      <TouchableOpacity style={{backgroundColor:colors.gray}} className="flex-row rounded-full p-1 px-2">
        <Text style={{color:colors.subText}} className="font-noto px-4 ">following</Text>
      </TouchableOpacity>
    </View>

    <Text style={{color:colors.text}} className='text-body font-noto'>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Error, numquam, asperiores quasi nemo nisi totam reprehenderit saepe, tenetur ut deleniti facere rerum ex soluta provident minus vel. Eius, 
      aut inventore!
    </Text>


    <View style={{paddingBottom:8}} className="mt-2 flex-row gap-2 items-center justify-between">
      <View style={{gap:14}} className=" items-end flex-row">
        <TouchableOpacity className=" flex-row gap-1 items-center">
          <LikeIcon width={26} height={26} color={colors.darkGray}/>
          <Text style={{color:colors.subText}} className='text-body font-noto'>123k</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" flex-row gap-1 items-center">
          <CommentIcon width={26} height={26}color={colors.darkGray}/>
          <Text style={{color:colors.subText}} className='text-body font-noto'>567k</Text>
        </TouchableOpacity>
      </View>

      <View className=" flex-row gap-1">
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
    </View>

  </View>

  
  )


}

export default PostOnlyText