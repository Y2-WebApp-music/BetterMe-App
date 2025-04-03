import { View, Text, RefreshControl, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { FlashList } from '@shopify/flash-list';
import { SERVER_URL } from '@env';
import axios from 'axios';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/authContext';
import { useTheme } from '../../../context/themeContext';
import { PostContent, TagCommunity } from '../../../types/community';
import { BottomSheetModal } from '@gorhom/bottom-sheet/src';
import BackButton from '../../../components/Back';
import SearchInput from '../../../components/SearchInput';
import PostWithPhoto from '../../../components/Post/postWithPhoto';
import PostOnlyText from '../../../components/Post/postOnlyText';
import CommentBottomModal from '../../../components/modal/CommentBottomModal';
import PostOptionBottomModal from '../../../components/modal/PostEditModal';

const SearchCommunity = () => {

  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const [tagName, setTagName] = useState('')
  const [isLoad, setIsLoad] = useState(false);

  const [tagPostList, setTagPostList] = useState<PostContent[] | null>(null)

  const getTagSearch = async (search:number) => {
    console.log('getTagSearch:',search);
    
    try {
      const response = await axios.post(`${SERVER_URL}/community/search/tag`, {
        tag:search
      });
      const data = response.data

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
  
        setTagPostList(formattedData);
      } else {
        return
      }

    } catch (error: any){
      console.error('Search Post Failed: ',error)
    } finally {
      setIsLoad(false)
    }
  }

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  
  
  const tagList = useMemo(() => TagCommunity, []);
  const handleTagSelected = async (id:number) => {
    const selectedTag = tagList.find(tag => tag.id === id);
    if (selectedTag) {
      await getTagSearch(selectedTag.id)
    }
  }
  
  useFocusEffect(
    useCallback(() => {
      setIsLoad(true)
      let tagID = parseInt(id.toString(), 10)
      let tagName = tagList.find(tag => tag.id === tagID);
      tagName ? setTagName(tagName.text) : setTagName('')
      handleTagSelected(tagID)
    }, [])
  );
    
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const handleOpenComment = (post_id: string) => {
    setSelectedPostId(post_id);
    bottomSheetModalRef.current?.present();
  };
  
  const optionSheetModalRef = useRef<BottomSheetModal>(null);
  const handleOpenOption = (post_id: string) => {
    setSelectedPostId(post_id);
    optionSheetModalRef.current?.present();
  };

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <View className='w-[92%]'>
          <View className='w-[92%] py-2'>
            <BackButton goto={'/'}/>
          </View>
        </View>
        <View className='w-full h-auto mb-2'>
          <View className='items-center justify-center w-full'>
            <Text style={{color:colors.subText}} className='font-noto text-body'>Tag</Text>
            <Text style={[{ fontSize: 26, color: colors.primary, fontWeight: '400' }]}>
              "{tagName}"
            </Text>
          </View>
        </View>
        <View style={{height:1, width:'100%',backgroundColor:colors.gray}}/>
        <ScrollView
          className='w-full h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start'}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEventThrottle={16}
        >

                {tagPostList && tagPostList.length != 0 ?(
                  <View className='w-full'>
                    <FlashList
                      data={tagPostList}
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
                            openComment={handleOpenComment}
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
                            openComment={handleOpenComment}
                            openOption={handleOpenOption}
                          />
                        )
                      )
                      }
                      estimatedItemSize={200}
                    />
                  </View>
                ):(
                  <View className='flex-1 justify-center items-center'>
                    <Text style={{color:colors.subText}} className='text-heading2'>No post</Text>
                  </View>
                )
          }
        </ScrollView>
        <CommentBottomModal ref={bottomSheetModalRef} post_id={selectedPostId} postList={tagPostList} setPostList={setTagPostList}/>
        <PostOptionBottomModal ref={optionSheetModalRef} post_id={selectedPostId}/>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SearchCommunity