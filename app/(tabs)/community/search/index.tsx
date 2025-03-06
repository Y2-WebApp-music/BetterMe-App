import { View, Text, RefreshControl, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useCallback, useState, useMemo, useRef } from 'react'
import BackButton from '../../../../components/Back';
import { useTheme } from '../../../../context/themeContext';
import { FlashList } from '@shopify/flash-list';
import { postDummy } from '../../../../types/community';
import { TagCommunity } from '../../../../types/community';
import PostWithPhoto from '../../../../components/Post/postWithPhoto';
import PostOnlyText from '../../../../components/Post/postOnlyText';
import SearchGoalCard from '../../../../components/goal/searchGoalCard';
import SearchInput from '../../../../components/SearchInput';
import SwitchToggleButton from '../../../../components/switchToggleButton';
import { BottomSheetModal } from '@gorhom/bottom-sheet/src';



const SearchCommunity = () => {

  const { colors } = useTheme();

  const [viewPost, setViewPost] = useState(true);
  const [viewGoals, setViewGoals] = useState(false);
  const [viewTag, setViewTag] = useState(false);

  const [postList, setPostList] = useState<number[]>([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])

  
  const [search, setSearch] = useState('')

  // filter post
  const filterPost = useMemo(() => {
    return postDummy.filter(post => 
      post.content.toLowerCase().includes(search.toLowerCase()) || 
      post.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // filter goal
  const filterGoals = useMemo(() => {
    return goalDataDummy.filter(goal => 
      goal.goal_name.toLowerCase().includes(search.toLowerCase()) || 
      goal.create_by.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // filter tag
  const filterTag = useMemo(() => {
    const matchTag = TagCommunity.filter(tag => 
      tag.text.toLowerCase().includes(search.toLowerCase())
    );
  
    const matchTagId = matchTag.map(tag => tag.id);
  
    return postDummy.filter(post => 
      post.tag.some(tagId => matchTagId.includes(tagId))
    );
  }, [search]);
  
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

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
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
          className='w-full h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className='items-center justify-center w-full mt-4'>
              <Text className='text-subTitle text-primary font-notoMedium'>Search in Community</Text>
              <View className='w-[92%]'>
            <SearchInput name={'Search post, tag, goal'} value={search} handleChange={(e)=>{setSearch(e)}}/>
          </View>
          </View>

          <View style={{height:1, width:'100%', backgroundColor:colors.gray}} className='my-3'/>

          <View className='flex-row w-[92%] justify-start items-center gap-4 ml-4'>
          <SwitchToggleButton
            label="post" 
            isActive={viewPost} 
            onPress={() => {
              setViewPost(true);
              setViewGoals(false);
              setViewTag(false);
            }} 
          />

          <View style={{ backgroundColor: colors.gray }} className='h-full w-[1px] rounded-full'/>
          <SwitchToggleButton
            label="goals" 
            isActive={viewGoals} 
            onPress={() => {
              setViewPost(false);
              setViewGoals(true);
              setViewTag(false);
            }} 
          />

          <View style={{ backgroundColor: colors.gray }} className='h-full w-[1px] rounded-full'/>
          <SwitchToggleButton
            label="tag"
            isActive={viewTag}
            onPress={() => {
              setViewPost(false);
              setViewGoals(false);
              setViewTag(true);
            }}
          />
          </View>

          <View style={{height:1, width:'100%',backgroundColor:colors.gray}} className='my-3'/>

          {viewPost && (
            postList.length != 0 ? (
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
                <View>
                  <Text style={{color:colors.subText}}>No post</Text>
                </View>
              )
          )}

          {viewGoals && (
            <FlashList
            data={filterGoals}
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
          )}

          {viewTag && (
            postList.length != 0 ? (
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
                <View>
                  <Text style={{color:colors.subText}}>No post</Text>
                </View>
              )
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const goalDataDummy = [
  {
    goal_id:'1',
    goal_name:'Title Test 1',
    start_date:new Date().toDateString(),
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)).toDateString(),
    total_task:3,
    create_by:'tennis',
    complete_task:2
  },
  {
    goal_id:'2',
    goal_name:'Title Test 2',
    start_date: new Date(new Date().setDate(new Date().getDate() + 45)).toDateString(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 90)).toDateString(),
    total_task:10,
    create_by:'guy',
    complete_task:5
  },
  {
    goal_id:'3',
    goal_name:'Title Test 3',
    start_date: new Date(new Date().setDate(new Date().getDate() + 6)).toDateString(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 80)).toDateString(),
    total_task:3,
    create_by:'owen',
    complete_task:2
  },
]

export default SearchCommunity