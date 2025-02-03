import { View, Text, RefreshControl, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import BackButton from '../../../components/Back';
import { useAuth } from '../../../context/authContext';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { PenIcon } from '../../../constants/icon';
import { FlashList } from '@shopify/flash-list';
import HomeGoalCard from '../../../components/goal/homeGoalCard';
import { homeGoalCardProp } from '../../../types/goal'





const screenWidth = Dimensions.get('window').width;

const UserProfile = () => {

  const { user } = useAuth();

  const [viewPost, setViewPost] = useState(true);

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
        <View className='w-[92%]'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/menu'}/>
          </View>
        </View>
        <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          >
            <View className='mb-4 flex flex-row-reverse gap-2 items-center'>
              <View className='grow'>
                <Text className='text-heading2 font-notoMedium'>{user?.displayName}</Text>
                <Text className='text-subText font-not pb-1'>{user?.email}</Text>
                <Text className='text-subText font-noto pb-1'>333k post 3333 goal</Text>
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

            <View className='flex-row justify-start items-center gap-4'>
              <TouchableOpacity onPress={()=>setViewPost(true)} className={`p-1 px-2 ${viewPost? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text className={`${viewPost? 'text-white':'text-subText'} text-heading2 font-notoMedium`}>post</Text>
              </TouchableOpacity>
              <View className='h-full w-[1px] bg-gray rounded-full'/>
              <TouchableOpacity onPress={()=>setViewPost(false)} className={`p-1 px-2 ${!viewPost? 'bg-primary':'bg-transparent'} rounded-normal`}>
                <Text className={`${!viewPost? 'text-white':'text-subText'} text-heading2 font-notoMedium`}>goals</Text>
              </TouchableOpacity>
            </View>

            <View style={{height:1, width:'100%'}} className=' bg-gray my-3'/>

            {viewPost? (
              <View></View>
            ):(
              <View className='w-full justify-center items-center gap-2 mt-2 pb-16'>
                <View className='flex-row items-center justify-center'>
                  <Text className='text-heading text-yellow'>33</Text>
                  <View style={{ transform: [{ translateY: 3 }]}}>
                    <Text className='text-body font-noto text-text pl-3'>In progress</Text>
                  </View>
                  <Text className='text-heading text-green pl-4'>123</Text>
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
                          <HomeGoalCard
                            goal_id={item.goal_id} 
                            goal_name={item.goal_name} 
                            end_date={item.end_date}
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
                          <HomeGoalCard 
                            goal_id={item.goal_id} 
                            goal_name={item.goal_name}
                            end_date={item.end_date} 
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