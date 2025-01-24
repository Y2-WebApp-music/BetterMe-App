import { View, Text, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import BackButton from '../../../components/Back'
import { router } from 'expo-router'
import { AddIcon, BackwardIcon, FoodIcon, ForwardIcon, LeftArrowIcon, RightArrowIcon } from '../../../constants/icon'
import WeekFoodChart from '../../../components/food/weekFoodChart'
import MealCard from '../../../components/food/mealCard'
import FoodToday from '../../../components/food/foodToday'
import FoodDaySummary from '../../../components/food/foodDaySummary'

const FoodSummary = () => {
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
              <Text className='text-subTitle text-primary font-notoMedium'>your meal</Text>
            </View>
            <View>
              <TouchableOpacity onPress={()=>{router.push('/calendar/addMeal')}} className='rounded-full p-1 px-4 bg-primary flex-row items-center justify-center gap-1'>
                <Text className='text-white font-noto text-heading3'>add meal</Text>
                <AddIcon width={22} height={22} color={'#fff'}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:6}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          <View className='gap-2'>
            <View className='flex-row mb-1'>
              <View className='grow'>
                <Text className=' text-heading3 font-noto'>Meal today</Text>
              </View>
              <Text className='text-subText font-noto'>
                {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
              </Text>
            </View>
            <FoodToday/>
            <MealCard meal_id={''} meal_date={new Date()} food_name={'TestMeal'} calorie={435} ai_create={true}/>
          </View>


          <View style={{height:1, width:'100%'}} className=' bg-gray my-2'/>


          <View className=''>
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

            <View>
              <View style={{ transform: [{ translateY: 6 }]}}>
                <Text className='text-subText font-noto text-detail'>Total Calories</Text>
              </View>
              <View className='flex-row'>
                <View className='flex-row items-end'>
                  <Text className='text-green font-notoMedium text-subTitle'>33333</Text>
                  <View style={{ transform: [{ translateY: -6 }]}}><Text className='text-subText font-noto text-body pl-1'>cal</Text></View>
                </View>
                <View style={{ transform: [{ translateY: -6 }]}} className='flex-row items-end'>
                  <Text className='text-subText font-notoLight text-detail pl-1'>Protein :</Text>
                  <Text className='text-subText font-noto text-body pl-1'>679</Text>
                  <Text className='text-subText font-noto text-detail pl-1'>g</Text>
                </View>
                <View style={{ transform: [{ translateY: -6 }]}} className='flex-row items-end'>
                  <Text className='text-subText font-notoLight text-detail pl-1'>Carbs :</Text>
                  <Text className='text-subText font-noto text-body pl-1'>679</Text>
                  <Text className='text-subText font-noto text-detail pl-1'>g</Text>
                </View>
                <View style={{ transform: [{ translateY: -6 }]}} className='flex-row items-end'>
                  <Text className='text-subText font-notoLight text-detail pl-1'>Fat :</Text>
                  <Text className='text-subText font-noto text-body pl-1'>679</Text>
                  <Text className='text-subText font-noto text-detail pl-1'>g</Text>
                </View>
              </View>
            </View>
          </View>
          <View className='p-4 bg-white border border-gray rounded-normal'>
            <View className='flex flex-row gap-2 items-center mb-2'>
              <FoodIcon width={15} height={15} color={'#0dc47c'}/>
              <Text className='text-body font-noto '>calorie in week</Text>
            </View>
            <View >
              <WeekFoodChart/>
            </View>
          </View>
          <View className='gap-2 pb-16 mt-2'>
            <FoodDaySummary/>
            <FoodDaySummary/>
            <FoodDaySummary/>
            <FoodDaySummary/>
            <FoodDaySummary/>
            <FoodDaySummary/>
            <FoodDaySummary/>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default FoodSummary