import { View, Text, RefreshControl, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import BackButton from '../../../../components/Back';
import { useTheme } from '../../../../context/themeContext';
import { SearchIcon } from '../../../../constants/icon';
import { FlashList } from '@shopify/flash-list';
import { postDummy } from '../../../../types/community';
import PostWithPhoto from '../../../../components/Post/postWithPhoto';
import PostOnlyText from '../../../../components/Post/postOnlyText';
import { GoalCreateCardProp, goalCreateDataDummy } from '../../../../types/goal';
import SearchGoalCard from '../../../../components/goal/searchGoalCard';
import SearchInput from '../../../../components/SearchInput';




const SearchCommunity = () => {

  const { colors } = useTheme();

  const [viewPost, setViewPost] = useState(true);
  const [viewGoals, setViewGoals] = useState(false);
  const [viewTag, setViewTag] = useState(false);

  const [postList, setPostList] = useState<number[]>([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])

  const [goal,setGoal] = useState<GoalCreateCardProp[]>([])
  const [search, setSearch] = useState('')
  
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <View className='w-full'>
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
          <View className='flex-row items-center justify-center w-full mt-4'>
              <Text className='text-subTitle text-primary font-notoMedium'>Search in Community</Text>
          </View>
          <SearchInput name={'Search post, tag, goal'} value={search} handleChange={(e)=>{setSearch(e)}}/>

          <View style={{height:1, width:'100%', backgroundColor:colors.gray}} className='my-3'/>

          <View className='flex-row w-[92%] justify-start items-center gap-4 ml-4'>
            <TouchableOpacity 
              onPress={() => {
                setViewPost(true);
                setViewGoals(false);
                setViewTag(false);
              }} 
              className={`p-1 px-4 ${viewPost ? 'bg-primary' : 'bg-transparent'} rounded-normal`}
            >
              <Text style={{color: viewPost ? '#fff' : colors.subText}} className='text-heading2 font-notoMedium'>post</Text>
            </TouchableOpacity>
            <View style={{backgroundColor:colors.gray}} className='h-full w-[1px] rounded-full'/>

            <TouchableOpacity 
              onPress={() => {
                setViewPost(false);
                setViewGoals(true);
                setViewTag(false);
              }} 
              className={`p-1 px-4 ${viewGoals ? 'bg-primary' : 'bg-transparent'} rounded-normal`}
            >
              <Text style={{color: viewGoals ? '#fff' : colors.subText}} className='text-heading2 font-notoMedium'>goals</Text>
            </TouchableOpacity>
            <View style={{backgroundColor:colors.gray}} className='h-full w-[1px] rounded-full'/>

            <TouchableOpacity 
              onPress={() => {
                setViewPost(false);
                setViewGoals(false);
                setViewTag(true);
              }} 
              className={`p-1 px-4 ${viewTag ? 'bg-primary' : 'bg-transparent'} rounded-normal`}
            >
              <Text style={{color: viewTag ? '#fff' : colors.subText}} className='text-heading2 font-notoMedium'>tag</Text>
            </TouchableOpacity>
          </View>

          <View style={{height:1, width:'100%',backgroundColor:colors.gray}} className='my-3'/>

          {viewPost && (
            postList.length != 0 ? (
              <View className='w-full'>
                <FlashList
                  data={postDummy}
                  renderItem={({ item }) => (
                    item.photo ? (
                      <PostWithPhoto _id={item._id} username={item.username} profile_img={item.profile_img} post_id={item.post_id} date={item.date} content={item.content} tag={item.tag} like={item.like} comment={item.comment} photo={item.photo} />
                    ) : (
                      <PostOnlyText/>
                    )
                  )}
                  estimatedItemSize={200}
                />
              </View>
            ) : (
              <View>
                <Text>No post</Text>
              </View>
            )
          )}

          {viewGoals && (
            <FlashList
            data={goalDataDummy}
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

          {/* {viewTag && (
            <View></View>
          )} */}

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