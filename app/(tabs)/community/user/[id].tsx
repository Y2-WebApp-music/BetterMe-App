import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import BackButton from '../../../../components/Back'
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '../../../../context/authContext';
import { FlashList } from '@shopify/flash-list';
import HomeGoalCard from '../../../../components/goal/homeGoalCard';
import { homeGoalCardProp } from '../../../../types/goal'
import PostWithPhoto from '../../../../components/Post/postWithPhoto';
import PostOnlyText from '../../../../components/Post/postOnlyText';
import { postDummy } from '../../../../types/community';
import CommunityGoalCard from '../../../../components/goal/communityGoalCard';
import { useTheme } from '../../../../context/themeContext';
import CommentBottomModal from '../../../../components/modal/CommentBottomModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet/src';


const screenWidth = Dimensions.get('window').width;

const Userprofile = () => {

  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [postList, setPostList] = useState<number[]>([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])

  const { user } = useAuth();

  const [goalList,setGoalList] = useState<homeGoalCardProp[]>([])
    
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
    // re-order from old to newest
      .sort((a, b) => {
        const dateA = new Date(a.end_date).setHours(0, 0, 0, 0);
        const dateB = new Date(b.end_date).setHours(0, 0, 0, 0);
        return dateA - dateB;
      }),
    ] : []
  
  const [viewPost, setViewPost] = useState(true);

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
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems:'center', marginTop:25}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
            <View className='mb-4 w-[92%] flex flex-row-reverse gap-2 items-center'>
              <View className='grow'>
                <Text style={{color:colors.text}} className='text-heading2 font-notoMedium'>Someone</Text>
                <Text style={{color:colors.subText}} className=' font-not pb-1'>maybe.gmail.com</Text>
                <Text style={{color:colors.subText}} className=' font-noto pb-1'>333k post 3333 goal</Text>
                <View>
                  <TouchableOpacity onPress={()=>{router.push(`/community/index`)}} style={{backgroundColor:colors.gray}} className=' flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
                    <Text style={{color:colors.text}} className=' text-body font-notoMedium'>following</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={require('../../../../assets/maleAvatar.png')}
                  contentFit="cover"
                  transition={1000}
                />
              </View>
            </View>

            <View style={{height:1, width:'100%',backgroundColor:colors.gray}} className=' my-3'/>

            <View className='flex-row w-[92%] justify-start items-center gap-4'>
              <TouchableOpacity onPress={()=>setViewPost(true)} className={`p-1 px-4 ${viewPost? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text style={{color:viewPost?'#fff':colors.subText}} className={` text-heading2 font-notoMedium`}>post</Text>
              </TouchableOpacity>
              <View style={{backgroundColor:colors.gray}} className='h-full w-[1px] rounded-full'/>
              <TouchableOpacity onPress={()=>setViewPost(false)} className={`p-1 px-4 ${!viewPost? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text style={{color:!viewPost?'#fff':colors.subText}} className={`text-heading2 font-notoMedium`}>goals</Text>
              </TouchableOpacity>
            </View>

            <View style={{height:1, width:'100%',backgroundColor:colors.gray}} className=' my-3'/>

            {viewPost? (
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
            ):(
              <View className='w-[92%] justify-center items-center gap-2 mt-2 pb-16'>
                <View className='flex-row items-center justify-center'>
                  <Text style={{color:colors.yellow}} className='text-heading'>33</Text>
                  <View style={{ transform: [{ translateY: 3 }]}}>
                    <Text style={{color:colors.text}} className='text-body font-noto  pl-3'>In progress</Text>
                  </View>
                  <Text style={{color:colors.green}} className='text-heading pl-4'>123</Text>
                  <View style={{ transform: [{ translateY: 3 }]}}>
                    <Text style={{color:colors.text}} className='text-body font-noto  pl-3'>Complete</Text>
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
                        <Text style={{color:colors.subText}} className='font-noto text-heading3 text-center'>No In Progress Goal</Text>
                      </View>
                    )}
                  </View>
                  <View className='mt-2 flex-col gap-2'>
                    <Text style={{color:colors.green}} className='text-body'>Completed</Text>
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
                        <Text style={{color:colors.subText}} className='font-noto text-heading3 text-center'>No Completed Goal</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
        </ScrollView>
      <CommentBottomModal ref={bottomSheetModalRef} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const goalDataDummy = [
  {
    goal_id:'1',
    goal_name:'Title Test 1',
    total_task:8,
    complete_task:3,
  },
  {
    goal_id:'2',
    goal_name:'Title Test 2',
    total_task:8,
    complete_task:3,
  },
  {
    goal_id:'3',
    goal_name:'Title Test 3',
    total_task:8,
    complete_task:3,
  },
]

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

export default Userprofile