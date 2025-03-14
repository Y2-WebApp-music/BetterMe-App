import { View, Text, RefreshControl, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import BackButton from '../../../../components/Back';
import { useTheme } from '../../../../context/themeContext';
import { FlashList } from '@shopify/flash-list';
import { PostContent, postDummy, searchGoalCard } from '../../../../types/community';
import { TagCommunity } from '../../../../types/community';
import PostWithPhoto from '../../../../components/Post/postWithPhoto';
import PostOnlyText from '../../../../components/Post/postOnlyText';
import SearchGoalCard from '../../../../components/goal/searchGoalCard';
import SearchInput from '../../../../components/SearchInput';
import SwitchToggleButton from '../../../../components/switchToggleButton';
import { BottomSheetModal } from '@gorhom/bottom-sheet/src';
import TextInputComment from '../../../../components/Post/textInputComment';
import { SERVER_URL } from '@env';
import axios from 'axios';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAuth } from '../../../../context/authContext';
import { useFocusEffect } from 'expo-router';

const SearchCommunity = () => {

  const { colors } = useTheme();
  const { user, userFollow } = useAuth()

  const [searchType, setSearchType] = useState<'post' | 'goal' | 'tag'>('post')
  const [search, setSearch] = useState<string>('')
  const [isSearching, setIsSearching] = useState(false)
  const [serverResponse, setServerResponse] = useState(false)
  const [isLoad, setIsLoad] = useState(false);

  const [postList, setPostList] = useState<PostContent[] | null>(null)
  const [goalList, setGoalList] = useState<searchGoalCard[] | null>(null)
  const [tagPostList, setTagPostList] = useState<PostContent[] | null>(null)

  const getFeed = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/community/post/feed/${user?._id}`);
      const data = response.data

      if ( data.message === "User not found") {return console.error('User not found')}

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
  
        setPostList(formattedData);
      } else {
        return
      }

    } catch (error: any){
      console.error('Get Post Error: ',error)
    }
  }

  const getPostSearch = async (search:string) => {
    setServerResponse(false)
    console.log('getPostSearch:',search);
    try {
      const response = await axios.post(`${SERVER_URL}/community/search/post`, {
        keyword:search
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
  
        setPostList(formattedData);
      } else {
        return
      }

    } catch (error: any){
      console.error('Search Post Failed: ',error)
    } finally {
      setServerResponse(true)
    }
  }

  const getGoalSearch = async (search:string) => {
    setServerResponse(false)
    console.log('getGoalSearch:',search);
    try {
      const response = await axios.post(`${SERVER_URL}/community/search/goal`, {
        keyword:search
      });
      const data = response.data

      if (data) {
        const formattedData: searchGoalCard[] = data.map((item: any) => ({
          goal_id: item.goal_id,
          goal_name: item.goal_name,
          total_task: item.total_task,
          start_date: item.start_date,
          end_date: item.end_date,
          complete_task: item.complete_task,
          create_by: item.create_by.username,
        }));
  
        setGoalList(formattedData);
      } else {
        return
      }

    } catch (error: any){
      console.error('Search Post Failed: ',error)
    } finally {
      setServerResponse(true)
    }
  }
  const getTagSearch = async (search:number) => {
    setServerResponse(false)
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
      setServerResponse(true)
    }
  }
  
  const handleSubmit = async () => {
    const selectedTag = tagList.find(tag => tag.text === search);
    if (searchType === 'post') {
      await getPostSearch(search)
    } else if (searchType === 'goal') {
      await getGoalSearch(search)
    } else if (searchType === 'tag') {
      selectedTag ?
        getTagSearch(selectedTag.id)
        : console.error('not match tag')
    } else {
      console.error('Can not search');
    }
  }

  useEffect(() => {

    const selectedTag = tagList.find(tag => tag.text === search);

    if (serverResponse){
      if (searchType === 'post') {
        console.log('go search post');
        
        getPostSearch(search)
      } else if (searchType === 'goal') {
        getGoalSearch(search)
      } else if (searchType === 'tag') {
        selectedTag ?
        getTagSearch(selectedTag.id)
        : setTagPostList([])
      } else {
        console.error('Can not search');
      }
    }
  },[searchType])

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleOpenPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const tagList = useMemo(() => TagCommunity, []);
  const handleTagSelected = async (id:number) => {
    const selectedTag = tagList.find(tag => tag.id === id);
    if (selectedTag) {
      setSearch(selectedTag.text);
      setIsSearching(false)
      await getTagSearch(selectedTag.id)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!serverResponse && search === ''){
        setIsLoad(true)
        getFeed().finally(()=>setIsLoad(false))
      }
    }, [serverResponse])
  );

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
        <View className='w-full h-auto'>
          <View className='items-center justify-center w-full mt-4'>
            <Text style={[{ fontSize: 26, color: colors.primary, fontWeight: '400' }]}>
              Search in Community
            </Text>
            <View style={{height:50}} className='w-full'>
              <SearchInput search={search} setSearch={setSearch} submit={handleSubmit} setFocus={setIsSearching} setClear={setServerResponse}/>
            </View>
          </View>
          <View style={{height:1, width:'100%', backgroundColor:colors.gray, marginTop:6}}/>
        </View>
        <ScrollView
          className='w-full h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEventThrottle={16}
        >
          <View className='flex-row w-[92%] justify-start items-center gap-4 ml-4'>
          <SwitchToggleButton
            label="post"
            isActive={searchType === 'post'}
            onPress={() => {
              setSearchType('post')
            }}
          />

          <View style={{ backgroundColor: colors.gray }} className='h-full w-[1px] rounded-full'/>
          <SwitchToggleButton
            label="goals"
            isActive={searchType === 'goal'}
            onPress={() => {
              setSearchType('goal')
            }}
          />

          <View style={{ backgroundColor: colors.gray }} className='h-full w-[1px] rounded-full'/>
          <SwitchToggleButton
            label="tag"
            isActive={searchType === 'tag'}
            onPress={() => {
              setSearchType('tag')
            }}
          />
          </View>

          <View style={{height:1, width:'100%',backgroundColor:colors.gray}} className='my-2'/>

          {searchType === 'post' && (
            postList && postList.length != 0 ?(
              <View className='w-full'>
                <FlashList
                  data={postList}
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
                        openComment={handleOpenPress}
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
                        openComment={handleOpenPress}
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
          )}

          {searchType === 'goal' && (
            goalList ? (
              <FlashList
                data={goalList}
                renderItem={({ item }) =>
                  <SearchGoalCard goal_id={item.goal_id}
                goal_name={item.goal_name}
                start_date={item.start_date}
                end_date={item.end_date}
                total_task={item.total_task}
                create_by={item.create_by}
                complete_task={item.complete_task}/>
                }
                estimatedItemSize={200}
              />
            ):(
              <View className='flex-1 justify-center items-center'>
                <Text style={{color:colors.subText}} className='text-heading2'>No goal</Text>
              </View>
            )
          )}

          {searchType === 'tag' && (
            isSearching ?(
              <SearchTag search={search} tagList={tagList} handleTagSelected={handleTagSelected}/>
            ):(
              serverResponse? (
                tagPostList && tagPostList.length != 0 ?(
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
                            openComment={handleOpenPress}
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
                            openComment={handleOpenPress}
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
              ):(
                <SearchTag search={search} tagList={tagList} handleTagSelected={handleTagSelected}/>
              )
            )
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

type SearchTagProp = {
  search:string;
  tagList:({id:number; text:string}[]);
  handleTagSelected:(item:number) => void
}
const SearchTag = ({search, tagList, handleTagSelected}:SearchTagProp) => {
  const { colors } = useTheme();

  const filteredTags = useMemo(() =>
    tagList.filter((tag) => tag.text.toLowerCase().includes(search.toLowerCase()))
  , [search, tagList]);

  return (
    <View className='justify-center items-center'>
      <View className='w-full justify-center items-start px-2'>
        <Text style={{color:colors.text}} className='font-notoMedium text-heading3'>Tag list</Text>
      </View>
      <View className='w-[96%]'>
        {filteredTags.length > 0?(
          <FlashList
            data={filteredTags}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.5}
                style={{borderColor:colors.gray, backgroundColor:colors.white}}
                className='p-2 px-4 w-full my-1 border rounded-normal'
                onPress={()=>{handleTagSelected(item.id)}}
              >
                <Text style={{color:colors.text}} className='text-body font-noto'>{item.text}</Text>
              </TouchableOpacity>
            )}
            estimatedItemSize={200}
          />
        ):(
          <View className='flex-1 justify-center items-center'>
            <Text style={{color:colors.subText}} className='font-noto text-body'>No Tag</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default SearchCommunity