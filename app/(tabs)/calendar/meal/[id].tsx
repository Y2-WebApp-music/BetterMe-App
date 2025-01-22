import { View, Text, SafeAreaView, ScrollView, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import BackButton from '../../../../components/Back'
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

const MealPage = () => {
  return (
    <SafeAreaView className="w-full h-full justify-start items-center bg-Background font-noto" >
      <View className='w-[92%] mt-4 flex-row'>
        <View className=''>
          <View className='max-w-[14vw]'>
            <BackButton />
          </View>
        </View>
      </View>
      <ScrollView
        className='w-[92%] h-auto pb-20 mt-2'
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
        showsVerticalScrollIndicator={false}
      >
        <View className=''>
          <View className='w-full flex-row'>
            <View className='grow'>
              <Text className='text-heading font-noto'>Food Meal Name</Text>
              <Text className='text-subText font-noto -translate-y-1'>portion</Text>
              <Text className='text-subText font-noto -translate-y-1 mt-1'>
                {new Intl.DateTimeFormat('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date())}
              </Text>
            </View>
            <View className='flex-row gap-1 items-center'>
              <Text className='text-title font-notoMedium text-primary'>468</Text>
              <View style={{transform:[{ translateY: 4 }]}}>
                <Text className='font-noto'>cal</Text>
              </View>
            </View>
          </View>

          <View style={styles.camera} className='bg-gray'></View>

          <View className='py-2'>
            <Text className='font-noto text-heading2'>Detail of this food</Text>
            <View className='flex gap-1' style={{transform:[{ translateY: -8 }]}}>
              <View className='flex-row gap-6'>
                <View className='flex-row gap-2 items-end'>
                  <Text className='text-body text-subText w-[14vw]'>Carbs</Text>
                  <View style={{transform:[{ translateY: 6 }]}}>
                    <Text className='text-heading font-notoMedium w-[8vw]'> 23 </Text>
                  </View>
                  <Text className='text-body text-subText'>grams</Text>
                </View>
                <View className='flex-row gap-2 items-end'>
                  <Text className='text-body text-subText w-[14vw]'>Protein</Text>
                  <View style={{transform:[{ translateY: 6 }]}}>
                    <Text className='text-heading font-notoMedium w-[8vw]'> 34 </Text>
                  </View>
                  <Text className='text-body text-subText'>grams</Text>
                </View>
              </View>
              <View className='flex-row gap-2 items-end'>
                <Text className='text-body text-subText w-[14vw]'>Fat</Text>
                <View style={{transform:[{ translateY: 6 }]}}>
                  <Text className='text-heading font-notoMedium w-[8vw]'> 76 </Text>
                </View>
                <Text className='text-body text-subText'>grams</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: screenWidth * 0.92,
    height: screenWidth * 0.92,
    borderRadius:12
  },
});

export default MealPage