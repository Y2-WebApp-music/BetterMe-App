import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, StyleSheet, Button, Image, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BackButton from '../../../components/Back'

import { Camera, FlashMode, CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '../../../components/FormInput';
import { CloseIcon, GalleryIcon } from '../../../constants/icon';
import { Skeleton } from 'moti/skeleton'
import { router } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const TakePicture = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [step, setStep] = useState(1)
  const [detail, setDetail] = useState<string>('')
  const [waiting, setWaiting] = useState(true)

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync()
        console.log(data);
        if (data) {
          setPhoto(data.uri);
          setStep(2)
        }
      } catch {

      }
    }
  };

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
      setStep(2)
    }
  };

  const handleSendPhoto = async () => {
    setWaiting(true)
    setStep(3)
    setTimeout(() => {
      setWaiting(false);
    }, 2000);
  }

  const handleAddFood = async () => {
    setStep(1)
    setPhoto('')
  }

  const handleComplete = async () => {
    setStep(1)
    setPhoto('')
    router.push('/(tabs)/calendar/weekCalendar');
  }

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:25}}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
        >
          {/*
            =============================
            ========== STEP1 ============
            =============================
           */}

          {step === 1 &&
            <View >
              <Text className='text-title font-notoSemiBold text-primary'>Take a Photo!</Text>
              <Text className='text-subText font-notoLight'>Snap a photo to identify your dishes. Learn nutritional facts and make healthier food choices every day!</Text>
              <View className='rounded-normal overflow-hidden mt-4'>
                  <CameraView
                    style={styles.camera}
                    facing={'back'}
                    ref={cameraRef}
                  >
                    <View className='w-full h-full p-2 justify-end items-end'>
                      <TouchableOpacity onPress={pickImage} className='h-12 w-12 rounded-normal bg-primary justify-center items-center'>
                        <GalleryIcon width={30} height={30} color={'white'}/>
                      </TouchableOpacity>
                    </View>
                  </CameraView>
              </View>
              <View className='w-full mt-10 justify-center items-center'>
                <TouchableOpacity onPress={takePicture} className=' bg-primary w-32 h-32 flex justify-center items-center rounded-full'>
                  <Text className='text-heading2 text-white font-notoMedium'>Capture</Text>
                </TouchableOpacity>
              </View>
            </View>
          }

          {/*
            =============================
            ========== STEP2 ============
            =============================
           */}

          {(step === 2 && photo) &&
            <View>
              <Text className='text-title font-notoSemiBold text-primary'>Add portion?</Text>
              <Text className='text-subText font-notoLight'>Ex. extra, large dish</Text>
              <View className=' relative rounded-normal overflow-hidden mt-4'>
                <Image
                  style={styles.camera}
                  source={{ uri: photo }}
                />
                <View className=' absolute top-0 w-full h-full p-2 justify-start items-end'>
                  <TouchableOpacity onPress={()=>setStep(1)} className='h-12 w-12 rounded-full bg-primary justify-center items-center'>
                    <CloseIcon width={42} height={42} color={'white'}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View className='w-full mt-4 justify-center items-center mb-10'>
                <FormInput
                  name={'Add some detail'}
                  value={detail}
                  handleChange={(e:string)=>setDetail(e)}
                  keyboardType={'default'}
                />
              </View>
              <View className='flex flex-row justify-center'>
                <TouchableOpacity
                  onPress={handleSendPhoto}
                  className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-10 bg-primary'
                >
                  <Text className='w-fit text-white text-heading font-notoMedium'>confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          }

          {/*
            =============================
            ========== STEP3 ============
            =============================
          */}
          {step === 3 && photo &&(
            <View className='h-auto w-full'>
            {waiting? (
              <View className=' relative w-full h-full justify-center items-start'>
                <View className='absolute top-[50%] z-10 w-full justify-center items-center'>
                  <Text className=' text-primary text-title font-notoMedium animate-pulse'>Waiting for Result</Text>
                </View>
                <View className=' opacity-40'>
                  {/* <Skeleton.Group show={waiting}>
                    <View className='flex flex-row'>
                      <Skeleton colorMode={'light'} radius={12} height={65} width={screenWidth * 0.52}/>
                      <View className='grow'/>
                      <Skeleton colorMode={'light'} radius={12} height={50} width={screenWidth * 0.32}/>
                    </View>
                    <View className='my-8'>
                      <Skeleton colorMode={'light'} radius={12} height={screenWidth * 0.92} width={screenWidth * 0.92}/>
                    </View>
                    <Skeleton colorMode={'light'} radius={12} height={120} width={screenWidth * 0.62}/>
                  </Skeleton.Group> */}
                </View>
              </View>
            ):(
              <View className='h-auto'>
                <View className='flex-row items-center'>
                  <Text className='text-title text-primary font-notoMedium'>Your Result</Text>
                  <View className='grow'/>
                  <View>
                    <TouchableOpacity
                        onPress={handleAddFood}
                        className='will-change-contents flex flex-row items-center justify-center p-1 px-4 rounded-full bg-gray'
                      >
                        <Text className='w-fit text-subText text-heading3 font-notoMedium'>Add new food</Text>
                      </TouchableOpacity>
                  </View>
                </View>
                <View className='w-full flex-row'>
                  <View className='grow'>
                    <Text className='text-heading font-noto'>กะเพราไก่</Text>
                    <Text className='text-subText font-noto -translate-y-1'>พิเศษ เพิ่มไข่ดาว</Text>
                  </View>
                  <View className='flex-row gap-1 items-end'>
                    <Text className='text-title font-notoMedium text-primary'>468</Text>
                    <View style={{transform:[{ translateY: -8 }]}}>
                      <Text className='font-noto'>cal</Text>
                    </View>
                  </View>
                </View>
                <View className=' relative rounded-normal overflow-hidden mt-4'>
                  {photo &&
                    <Image
                      style={styles.camera}
                      source={{ uri: photo }}
                    />
                  }
                </View>
                <View className='py-2'>
                  <Text className='font-noto text-heading2'>Detail of this food</Text>
                  <View className='flex gap-1' style={{transform:[{ translateY: -8 }]}}>
                    <View className='flex-row gap-6'>
                      <View className='flex-row gap-2 items-end'>
                        <Text className='text-body text-subText w-[14vw]'>Carbs</Text>
                        <View style={{transform:[{ translateY: 6 }]}}>
                          <Text className='text-heading font-notoMedium w-[8vw]'>{result.nutrias.carbs}</Text>
                        </View>
                        <Text className='text-body text-subText'>grams</Text>
                      </View>
                      <View className='flex-row gap-2 items-end'>
                        <Text className='text-body text-subText w-[14vw]'>Protein</Text>
                        <View style={{transform:[{ translateY: 6 }]}}>
                          <Text className='text-heading font-notoMedium w-[8vw]'>{result.nutrias.protein}</Text>
                        </View>
                        <Text className='text-body text-subText'>grams</Text>
                      </View>
                    </View>
                    <View className='flex-row gap-2 items-end'>
                      <Text className='text-body text-subText w-[14vw]'>Fat</Text>
                      <View style={{transform:[{ translateY: 6 }]}}>
                        <Text className='text-heading font-notoMedium w-[8vw]'>{result.nutrias.fat}</Text>
                      </View>
                      <Text className='text-body text-subText'>grams</Text>
                    </View>
                  </View>
                </View>
                <View className='pt-4'>
                  <TouchableOpacity
                    onPress={handleComplete}
                    className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-10 bg-primary'
                  >
                    <Text className='w-fit text-white text-heading font-notoMedium'>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            </View>
            )
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const result = {
  menu:'กะเพราไก่',
  portion:'พิเศษ เพิ่มไข่ดาว',
  calorie:124,
  photo:'',
  nutrias:{
    carbs:45,
    protein:12,
    fat:9
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: screenWidth * 0.92,
    height: screenWidth * 0.92,
    borderRadius:12
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default TakePicture