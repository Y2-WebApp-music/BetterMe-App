import { View, Text, SafeAreaView, ScrollView, Dimensions, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import BackButton from '../../../../components/Back'
import { format } from 'date-fns';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { Meal } from '../../../../types/food';
import { Image } from 'expo-image';
import { useTheme } from '../../../../context/themeContext';

const screenWidth = Dimensions.get('window').width;

const MealPage = () => {

  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  const [meal, setMeal] = useState<Meal>()

  const getMeal = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/meal/detail/${id}`);
      const data = response.data

      console.log('response getMeal \n',data);
      if ( data.message === "No meals found") {return}

      if (data) {
        setMeal(data)
        console.log(meal?.image_url);
        
      } else {
        console.warn('No data fetch')
      }

    } catch (error: any){
      console.error(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getMeal()
    }, [])
  );

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-start items-center font-noto" >
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
              <Text style={{color:colors.text}} className='text-heading font-noto'>{meal?.food_name}</Text>
              {meal?.portion &&
                <Text style={{color:colors.subText}} className='font-noto -translate-y-1'>{meal?.portion}</Text>
              }
              <Text style={{color:colors.subText}} className='font-noto -translate-y-1 mt-1'>
                {new Intl.DateTimeFormat('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(meal?.meal_date || 0))}
              </Text>
            </View>
            <View className='flex-row gap-1 items-center'>
              <Text className='text-title font-notoMedium text-primary'>{meal?.calorie}</Text>
              <View style={{transform:[{ translateY: 4 }]}}>
                <Text style={{color:colors.text}} className='font-noto'>cal</Text>
              </View>
            </View>
          </View>

          {/* <View style={styles.camera} className=''> */}
          <View style={{borderColor:colors.gray}} className='overflow-hidden rounded-normal border'>
            <Image
                style={styles.camera}
                source={meal?.image_url}
                contentFit="cover"
                transition={1000}
              />
          </View>
          {/* </View> */}

          <View className='py-2'>
            <Text style={{color:colors.text}} className='font-noto text-heading2'>Detail of this food</Text>
            <View className='flex gap-1' style={{transform:[{ translateY: -8 }]}}>
              <View className='flex-row gap-6'>
                <View className='flex-row gap-2 items-end'>
                  <Text style={{color:colors.subText}} className='text-body w-[14vw]'>Carbs</Text>
                  <View style={{transform:[{ translateY: 6 }]}}>
                    <Text style={{color:colors.text}}className='text-heading font-notoMedium w-[8vw]'> {meal?.carbs} </Text>
                  </View>
                  <Text style={{color:colors.subText}} className='text-body '>grams</Text>
                </View>
                <View className='flex-row gap-2 items-end'>
                  <Text style={{color:colors.subText}} className='text-body w-[14vw]'>Protein</Text>
                  <View style={{transform:[{ translateY: 6 }]}}>
                    <Text style={{color:colors.text}} className='text-heading font-notoMedium w-[8vw]'> {meal?.protein} </Text>
                  </View>
                  <Text style={{color:colors.subText}} className='text-body '>grams</Text>
                </View>
              </View>
              <View className='flex-row gap-2 items-end'>
                <Text style={{color:colors.subText}} className='text-body w-[14vw]'>Fat</Text>
                <View style={{transform:[{ translateY: 6 }]}}>
                  <Text style={{color:colors.text}} className='text-heading font-notoMedium w-[8vw]'> {meal?.fat} </Text>
                </View>
                <Text style={{color:colors.subText}} className='text-body '>grams</Text>
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