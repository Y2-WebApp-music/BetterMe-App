import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import BackButton from '../../../../components/Back'
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '../../../../context/authContext';
import { FlashList } from '@shopify/flash-list';
import CalendarGoalCard from '../../../../components/goal/calendarGoalCard';




const screenWidth = Dimensions.get('window').width;

const Userprofile = () => {

  const { id } = useLocalSearchParams();

  const { user } = useAuth();
  
  const [viewPost, setViewPost] = useState(true);

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
                <Text className='text-heading2 font-notoMedium'>Guy Nut</Text>
                <Text className='text-subText font-not pb-1'>maybe.gmail.com</Text>
                <Text className='text-subText font-noto pb-1'>333k post 3333 goal</Text>
                <View>
                  <TouchableOpacity onPress={()=>{router.push(`/community/index`)}} className=' bg-gray flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
                    <Text className='text-subText text-body font-notoMedium'>following</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../../../assets/maleAvatar.png') : require('../../../../assets/femaleAvatar.png')}
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
                  <Text className='text-body text-yellow pb-3'>In progress</Text>
                  <FlashList
                    data={goalDataDummy}
                    renderItem={({ item }) =>
                      <CalendarGoalCard goal_id={item.goal_id} goal_name={item.goal_name} total_task={item.total_task} complete_task={item.complete_task}/>
                    }
                    estimatedItemSize={200}
                  />
                  <Text className='text-body text-green pb-3'>Completed</Text>

                </View>
              </View>
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