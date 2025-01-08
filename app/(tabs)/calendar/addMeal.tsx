import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../../../components/Back';
import { router } from 'expo-router';
import { CloseIcon, GalleryIcon } from '../../../constants/icon';
import * as ImagePicker from 'expo-image-picker';

const screenWidth = Dimensions.get('window').width;

const AddMeal = () => {

  const [photo, setPhoto] = useState<string | null>(null);

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
          <TouchableOpacity onPress={()=>{router.push('/camera/')}} className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full'>
            <Text className='text-body text-white font-notoMedium'>Use Ai</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        className='w-[92%] h-auto pb-20 mt-2'
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
        showsVerticalScrollIndicator={false}
      >
        <View className=''>
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
          <TouchableOpacity className=' bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full mt-2'>
            <Text className='text-heading2 text-white font-notoMedium'>Add Meal</Text>
          </TouchableOpacity>
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

export default AddMeal