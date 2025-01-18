import React, { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../../../components/Back';
import { router } from 'expo-router';
import { CloseIcon, GalleryIcon } from '../../../constants/icon';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '../../../components/FormInput';
import { Meal } from '../../../types/food';
import { useAuth } from '../../../context/authContext';
import RainbowButton from '../../../components/RainbowButton';

const screenWidth = Dimensions.get('window').width;

type MealProp = {
  create_by:string
  meal_date:Date
  food_name:string
  portion:string
  image_url:string
  calorie:number
  protein :number
  carbs:number
  fat:number
  createByAI:boolean
}

const AddMeal = () => {

  const { user } = useAuth()

  const [photo, setPhoto] = useState<string | null>(null);
  const [form, setForm] = useState<MealProp>({
    create_by:user?._id || '',
    meal_date:new Date(),
    food_name:'',
    portion:'',
    image_url:'',
    calorie:0,
    protein :0,
    carbs:0,
    fat:0,
    createByAI:false
  })

  const removeImage = () =>{
    setPhoto(null)
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      selectionLimit:10,
    });

    console.log(result);

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="w-full h-full justify-start items-center bg-Background font-noto" >
      <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, width:"100%",alignItems:'center' }}
          >
      <View className='w-[92%] mt-4'>
        <View className='w-full'>
          <View className='max-w-[14vw]'>
            <BackButton />
          </View>
        </View>
        <View className='flex flex-row gap-2 items-center mt-2'>
          <View className='grow'>
            <Text className='text-subTitle text-primary font-notoMedium'>Add Meal</Text>
          </View>
          <TouchableOpacity onPress={()=>{}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
            <Text className='text-heading2 text-white font-notoMedium'>Add meal</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        className='w-[92%] h-auto pb-20 mt-2'
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
        showsVerticalScrollIndicator={false}
      >
        <View className='pb-20'>
          {!photo &&
            <TouchableOpacity onPress={pickImage} style={{width:screenWidth * 0.92, height:screenWidth * 0.92}} className=' rounded-normal bg-gray flex justify-center items-center'>
              <View className='rounded-normal justify-center items-center'>
                <GalleryIcon width={60} height={60} color={'#CFCFCF'}/>
                <Text className='text-subText font-noto mt-2'>Chose Photo</Text>
              </View>
            </TouchableOpacity>
          }
          {photo &&
            <View className=' relative rounded-normal overflow-hidden mt-4'>
              <Image
                style={styles.camera}
                source={{ uri: photo }}
              />
              <View className=' absolute top-0 w-full h-full p-2 justify-start items-end'>
                <TouchableOpacity onPress={removeImage} className='h-12 w-12 rounded-full bg-primary justify-center items-center'>
                  <CloseIcon width={42} height={42} color={'white'}/>
                </TouchableOpacity>
              </View>
            </View>
          }
          
            <View>
              <FormInput
                name={'Name of food'}
                value={form.food_name}
                handleChange={(e:string)=>{setForm({...form,food_name:e})}}
                keyboardType={'default'}
              />
              <FormInput
                name={'Portion'}
                value={form.portion}
                handleChange={(e:string)=>{setForm({...form,portion:e})}}
                keyboardType={'default'}
              />
              <View className='flex-row gap-2'>
                <View className='grow'>
                  <FormInput
                    name={'protein'}
                    value={form.food_name}
                    handleChange={(e:string)=>{setForm({...form,food_name:e})}}
                    keyboardType={'default'}
                  />
                </View>
                <View className='grow'>
                  <FormInput
                    name={'carbs'}
                    value={form.portion}
                    handleChange={(e:string)=>{setForm({...form,portion:e})}}
                    keyboardType={'default'}
                  />
                </View>
                <View className='grow'>
                  <FormInput
                    name={'fat'}
                    value={form.portion}
                    handleChange={(e:string)=>{setForm({...form,portion:e})}}
                    keyboardType={'default'}
                  />
                </View>
              </View>
            </View>
            {/* <View className=''>
              <TouchableOpacity className=' bg-gray flex-row gap-2 p-2 px-4 border border-primary justify-center items-center rounded-full mt-2'>
                <Text className='text-body text-subText font-notoMedium'>auto fill with ai</Text>
              </TouchableOpacity>
            </View> */}
            <View className='w-[300px] h-fit py-6'>
              <RainbowButton/>
            </View>
          
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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

export default AddMeal