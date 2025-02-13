import { View, Text, RefreshControl, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import BackButton from '../../../components/Back';
import { useAuth } from '../../../context/authContext';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { PenIcon } from '../../../constants/icon';
import { FlashList } from '@shopify/flash-list';
import HomeGoalCard from '../../../components/goal/homeGoalCard';
import { homeGoalCardProp } from '../../../types/goal'
import axios from 'axios';
import { SERVER_URL } from '@env';
import PostOnlyText from '../../../components/Post/postOnlyText';
import PostWithPhoto from '../../../components/Post/postWithPhoto';
import { postDummy } from '../../../types/community';
import CommunityGoalCard from '../../../components/goal/communityGoalCard';





const screenWidth = Dimensions.get('window').width;

const UserProfile = () => {

  const { user } = useAuth();

  const [viewPost, setViewPost] = useState(true);
  const [postList, setPostList] = useState<number[]>([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])

  const [goalList,setGoalList] = useState<homeGoalCardProp[]>([])
  const [noGoal, setNoGoal] = useState(false)

  const getAllGoal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/goal/user/${user?._id}`);
      const data = response.data // homeGoalCardProp[]

      // console.log('getAllGoal response \n',response.data);

      if (data.message === "No goal") {
        setNoGoal(true)
      } else {
        setGoalList([
          ...data.map((goal: any) => ({
            goal_id:goal.goal_id,
            goal_name:goal.goal_name,
            total_task:goal.total_task,
            complete_task:goal.complete_task,
            end_date:goal.end_date,
          })),
        ])
      }

    } catch (error: any){
      console.error(error)
    }
  }
  
  const completeGoal = goalList?[
    ...goalList
  // select only complete goal
    .filter((goal) => goal.total_task === goal.complete_task) 
  // re-order from old to newest
    .sort((a, b) => {
      const dateA = new Date(a.end_date).setHours(0, 0, 0, 0);
      const dateB = new Date(b.end_date).setHours(0, 0, 0, 0);
      return dateA - dateB;
    }),
  ] : []

  const inprogressGoal = goalList?[
    ...goalList
  // select only inprogress goal
    .filter((goal) => goal.total_task !== goal.complete_task)
    .filter((goal) => new Date(goal.end_date) > new Date())
  // re-order from old to newest
    .sort((a, b) => {
      const dateA = new Date(a.end_date).setHours(0, 0, 0, 0);
      const dateB = new Date(b.end_date).setHours(0, 0, 0, 0);
      return dateA - dateB;
    }),
  ] : []

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getAllGoal().finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllGoal()
    }, [])
  );

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems:'center', marginTop:25}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
            <View className='mb-4 w-[92%] flex flex-row-reverse gap-2 items-center'>
              <View className='grow'>
                <Text className='text-heading2 font-notoMedium'>{user?.displayName}</Text>
                <Text className='text-subText font-not pb-1'>{user?.email}</Text>
                <Text className='text-subText font-noto pb-1'>333k post {goalList.length} goal</Text>
                <View>
                  <TouchableOpacity onPress={()=>{router.push(`/community/post/create`)}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
                    <Text className='text-body text-white font-notoMedium'>Create post</Text>
                    <PenIcon width={22} height={22} color={'white'}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../assets/maleAvatar.png') : require('../../../assets/femaleAvatar.png')}
                  contentFit="cover"
                  transition={1000}
                />
              </View>
            </View>

            <View style={{height:1, width:'100%'}} className=' bg-gray my-3'/>

            <View className='flex-row w-[92%] justify-start items-center gap-4'>
              <TouchableOpacity onPress={()=>setViewPost(true)} className={`p-1 px-4 ${viewPost? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text className={`${viewPost? 'text-white':'text-subText'} text-heading2 font-notoMedium`}>post</Text>
              </TouchableOpacity>
              <View className='h-full w-[1px] bg-gray rounded-full'/>
              <TouchableOpacity onPress={()=>setViewPost(false)} className={`p-1 px-4 ${!viewPost? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text className={`${!viewPost? 'text-white':'text-subText'} text-heading2 font-notoMedium`}>goals</Text>
              </TouchableOpacity>
            </View>

            <View style={{height:1, width:'100%'}} className=' bg-gray my-3'/>

            {viewPost? (
              postList.length != 0 ? (
                <View className='w-full'>
                  <FlashList
                    data={postDummy}
                    renderItem={({ item }) => (
                      item.photo? (
                        <PostWithPhoto _id={item._id} username={item.username} profile_img={item.profile_img} post_id={item.post_id} date={item.date} content={item.content} tag={item.tag} like={item.like} comment={item.comment} photo={item.photo} />
                      ):(
                        <PostOnlyText/>
                      )
                    )
                    }
                    estimatedItemSize={200}
                  />
                </View>
              ):(
                <View>
                  <Text>No post</Text>
                </View>
              )
            ):(
              <View className='w-[92%] justify-center items-center gap-2 mt-2 pb-16'>
                <View className='flex-row items-center justify-center'>
                  <Text className='text-heading text-yellow'>{inprogressGoal.length}</Text>
                  <View style={{ transform: [{ translateY: 3 }]}}>
                    <Text className='text-body font-noto text-text pl-3'>In progress</Text>
                  </View>
                  <Text className='text-heading text-green pl-4'>{completeGoal.length}</Text>
                  <View style={{ transform: [{ translateY: 3 }]}}>
                    <Text className='text-body font-noto text-text pl-3'>Complete</Text>
                  </View>
                </View>
                <View className='w-full'>
                  <View className='mt-2 flex-col gap-2'>
                    <Text className='text-body text-yellow'>In Progress</Text>
                    {inprogressGoal.length > 0 ? (
                      <FlashList
                        data={inprogressGoal}
                        renderItem={({ item }) =>
                          <CommunityGoalCard
                            goal_id={item.goal_id} 
                            goal_name={item.goal_name} 
                            total_task={item.total_task} 
                            complete_task={item.complete_task}
                          />
                        }
                        estimatedItemSize={200}
                      />
                    ) : (
                      <View style={{width:'100%', height:80, justifyContent:'center', alignContent:'center'}}>
                        <Text className='font-noto text-subText text-heading3 text-center'>No In Progress Goal</Text>
                      </View>
                    )}
                  </View>
                  <View className='mt-2 flex-col gap-2'>
                    <Text className='text-body text-green'>Completed</Text>
                    {completeGoal.length > 0 ? (
                      <FlashList
                        data={completeGoal}
                        renderItem={({ item }) =>
                          <CommunityGoalCard 
                            goal_id={item.goal_id} 
                            goal_name={item.goal_name}
                            total_task={item.total_task} 
                            complete_task={item.complete_task}
                          />
                        }
                        estimatedItemSize={200}
                      />
                    ) : (
                      <View style={{width:'100%', height:80, justifyContent:'center', alignContent:'center'}}>
                        <Text className='font-noto text-subText text-heading3 text-center'>No Completed Goal</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  imageContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: (screenWidth * 0.3) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default UserProfile