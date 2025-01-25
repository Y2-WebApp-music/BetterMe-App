import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import BackButton from '../../../components/Back'
import { BackwardIcon, ForwardIcon, NightIcon } from '../../../constants/icon'
import SleepToday from '../../../components/sleep/sleepToday'
import WeekSleepChart from '../../../components/sleep/weekSleepChart'
import SleepDaySummary from '../../../components/sleep/sleepDaySummary'
import Animated, { useAnimatedRef, useAnimatedStyle, useScrollViewOffset, withTiming } from 'react-native-reanimated'

const SleepSummary = () => {

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(scrollRef);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHandler. value > 330 ? withTiming(1) : withTiming(0),
    }
  }) ;

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
          <View className='my-2 mt-3 flex-row justify-center items-center'>
            <View className='grow'>
              <Text className='text-subTitle text-primary font-notoMedium'>your sleep</Text>
            </View>
          </View>
        </View>

        <View className='w-[92%]'>
          <Animated.View style={[buttonStyle]} className='w-full absolute top-0 z-10 bg-Background'>
            <SummaryHeader/>
          </Animated.View>
        </View>

        <ScrollView
          ref={scrollRef}
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          <View className='gap-2'>
            <View className='flex-row mb-1'>
              <View className='grow'>
                <Text className=' text-heading3 font-noto'>Last Night</Text>
              </View>
              <Text className='text-subText font-noto'>
                {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
              </Text>
            </View>
            <SleepToday/>
          </View>


          <View style={{height:1, width:'100%'}} className=' bg-gray my-2'/>

          <SummaryHeader/>

          <View className='p-4 bg-white border border-gray rounded-normal'>
            <View className='flex flex-row gap-2 items-center mb-2'>
              <NightIcon width={15} height={15} color={'#454ab6'}/>
              <Text className='text-body font-noto'>Sleep Time</Text>
            </View>
            <View >
              <WeekSleepChart/>
            </View>
          </View>

          <View className='gap-2 pb-16 mt-2'>
            <SleepDaySummary/>
            <SleepDaySummary/>
            <SleepDaySummary/>
            <SleepDaySummary/>
            <SleepDaySummary/>
            <SleepDaySummary/>
            <SleepDaySummary/>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const SummaryHeader = () => {
  return (
    <View className='my-2'>
            <View className='flex-row items-center'>
              <View className='grow'>
                <Text className='font-notoMedium text-heading2'>Summary</Text>
                <Text className='font-noto text-heading3 pl-1'>14-21 Aug 2024</Text>
              </View>
              <View className='flex-row gap-3 pr-2'>
                <TouchableOpacity>
                  <BackwardIcon width={34} height={34} color={'#1c60de'}/>
                </TouchableOpacity>
                <TouchableOpacity>
                  <ForwardIcon width={34} height={34} color={'#1c60de'}/>
                </TouchableOpacity>
              </View>
            </View>

            <View className='flex-row gap-5 items-center'>
              <View style={{ transform: [{ translateY: 6 }]}}>
                <Text className='text-subText font-noto text-detail'>Total sleep time</Text>
                <View className='flex-row items-end gap-1'>
                  <Text className='text-night font-notoMedium text-title'>33</Text>
                  <View style={{ transform: [{ translateY: -8 }]}}>
                    <Text className='text-subText font-noto'>h</Text>
                  </View>
                  <Text className='text-night font-notoMedium text-title'>33</Text>
                  <View style={{ transform: [{ translateY: -8 }]}}>
                    <Text className='text-subText font-noto'>m</Text>
                  </View>
                </View>
              </View>
              <View style={{ transform: [{ translateY: 6 }]}}>
                <Text className='text-subText font-noto text-detail'>Average time</Text>
                <View className='flex-row items-end gap-1'>
                  <Text className='font-noto text-subTitle'>33</Text>
                  <View style={{ transform: [{ translateY: -6 }]}}>
                    <Text className='text-subText font-noto'>h</Text>
                  </View>
                  <Text className='font-noto text-subTitle'>33</Text>
                  <View style={{ transform: [{ translateY: -6 }]}}>
                    <Text className='text-subText font-noto'>m</Text>
                  </View>
                </View>
              </View>
              <View className='flex-row gap-3'>
                <View style={{ transform: [{ translateY: 6 }]}} className=' items-center'>
                  <Text className='text-subText font-noto text-detail'>wake up</Text>
                  <View className='flex-row items-end gap-1'>
                    <Text className='font-noto text-heading2 text-subText'>33</Text>
                    <View style={{ transform: [{ translateY: -6 }]}}>
                      <Text className='text-subText font-noto'>:</Text>
                    </View>
                    <Text className='font-noto text-heading2 text-subText'>33</Text>
                  </View>
                </View>
                <View style={{ transform: [{ translateY: 6 }]}} className=' items-center'>
                  <Text className='text-subText font-noto text-detail'>sleep</Text>
                  <View className='flex-row items-end gap-1'>
                    <Text className='font-noto text-heading2 text-subText'>33</Text>
                    <View style={{ transform: [{ translateY: -6 }]}}>
                      <Text className='text-subText font-noto'>:</Text>
                    </View>
                    <Text className='font-noto text-heading2 text-subText'>33</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
  )
}

export default SleepSummary