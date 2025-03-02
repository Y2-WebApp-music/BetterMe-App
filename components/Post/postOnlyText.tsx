import React, { useState } from 'react'
import { Image } from 'expo-image';
import { LikeIcon,CommentIcon } from '../../constants/icon'
import { useTheme } from '../../context/themeContext';
import { PostContent, TagCommunity } from '../../types/community';
import { View, Text,TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback} from 'react-native'
import FollowButton from './followButton';
import { router } from 'expo-router';

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

  const [data, setData]= useState<PostContent>({
      _id:'string',
      username:'Alex Kim',
      date:'2025-02-04T05:54:45.558+00:00',
      profile_img:'https://picsum.photos/270',
      post_id:'wj54knwgeavi89q45ui3gv',
      content:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem magni facere quasi at temporibus quibusdam provident neque blanditiis quas praesentium ad, veniam, molestias quo, non autem fugiat dolorem nihil error!',
      tag:[1,2,3,4],
      like:4123,
      comment:1345,
      photo:[],
    })

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
    <View className='mb-4'>
      <FollowButton/>
    </View>
    </View>
    <TouchableWithoutFeedback onPress={()=>{router.push(`/community/post/1234`)}}>
        <Text style={{color:colors.text}} className='text-body font-noto' >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
          Error, numquam, asperiores quasi nemo nisi totam reprehenderit saepe, tenetur ut deleniti facere rerum ex soluta provident minus vel. Eius, 
          aut inventore!
        </Text>
    </TouchableWithoutFeedback>


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
      <TagList tagId={data.tag}/>
      </View>
    </View>

  </View>

  
  )


}

export default PostOnlyText