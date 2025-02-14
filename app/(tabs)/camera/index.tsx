import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, StyleSheet, Button, Image, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BackButton from '../../../components/Back'

import { Camera, FlashMode, CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '../../../components/FormInput';
import { CloseIcon, GalleryIcon } from '../../../constants/icon';
import { Skeleton } from 'moti/skeleton'
import { router, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { useAuth } from '../../../context/authContext';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseStorage } from '../../../components/auth/firebaseConfig';
import { format } from 'date-fns';
import { MealAi } from '../../../types/food';
import * as ImageManipulator from 'expo-image-manipulator';

const screenWidth = Dimensions.get('window').width;

const TakePicture = () => {
  const { user } = useAuth()

  const cameraRef = useRef<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [data, setData] = useState<MealAi>({
    food_name:'',
    calorie:0,
    protein:0,
    carbs:0,
    fat:0,
  })
  const [step, setStep] = useState(1)
  const [detail, setDetail] = useState<string>('')
  const [waiting, setWaiting] = useState(true)
  const [permission, requestPermission] = useCameraPermissions();
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  useEffect(() => {
    if (permission === null || !permission.granted) {
      const timer = setTimeout(() => {
        requestPermission();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [permission, requestPermission]);

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

  const handleAddFood = async () => {
    setPhoto('')
    setDownloadURL('')
    setStep(1)
  }

  const handleComplete = async () => {
    setStep(1)
    setPhoto('')
    setDownloadURL('')
    router.push('/(tabs)/calendar/weekCalendar');
  }

  const handleSendPhoto = async () => {
    setWaiting(true)
    setStep(3)
    await getMealByAI()
  }

  useEffect(() => {
    console.log('Updated downloadURL:', downloadURL);
  }, [downloadURL]);

  const uploadToFirebase = async () => {
    const metadata = {
      contentType: 'image/png',
    };

    if (!photo || !user) {
      console.log('!photo || !user || !form.meal_date ');
      return null
    }

    console.log('uploadToFirebase()');

    try {
      if (photo && user) {
        console.log('Uploading to Firebase....');

        const storageRef = ref(firebaseStorage, `meal/${user.uid}/${format(new Date(), 'dd-MM-yyyy-H-m')}.png`);

        const resPhoto = await fetch(photo);
        const blob = await resPhoto.blob();

        const extension = photo.split('.').pop();
        const mimeType = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : 'image/png';

        const uploadTask = await uploadBytes(storageRef, blob, { ...metadata, contentType: mimeType });
        console.log('uploadTask ',uploadTask);

        const url = await getDownloadURL(uploadTask.ref);
        setDownloadURL(url);
        console.log('Upload Complete', url);
        return url

      }
    } catch (error) {
      console.error('Upload failed', error);
    }
  }

  const handleImageUpload = async () => {
    if (!downloadURL) {
      console.log('downloadURL is empty try to upload and get URl');
      const url = await uploadToFirebase();
      if (url !== undefined) {
        setDownloadURL(url)
        return url
      }
      console.error('Fail to get Image URL')
    }
    return downloadURL;
  };

  const getMealByAI = async () => {
    setStep(3);
    setWaiting(true);
    
    try {
      if (!photo) return;
  
      const url = await handleImageUpload();
  
      // Compress and convert to blob (force it as JPEG)
      const compressedImage = await ImageManipulator.manipulateAsync(
        photo,
        [],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      const response = await fetch(compressedImage.uri);
      const blob = await response.blob();
  
      console.log("Blob Type:", blob.type);
      console.log("Blob Size:", blob.size);
  
      // Convert blob to base64 with image/jpeg type
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result && typeof reader.result === "string") {
          let base64Image = reader.result;
          // Replace MIME type to ensure proper format
          base64Image = base64Image.replace(/^data:image\/[^;]+/, "data:image/jpeg");
  
          // Log Base64 image string
          console.log("Base64 Image String:", base64Image.substring(0, 100) + "...");
  
          try {
            const res = await axios.post(`${SERVER_URL}/meal/by-ai`, {
              image: base64Image,
              portion: detail,
            });
  
            console.log("API Response:", res.data);
  
            let mealData: MealAi | null = res.data.data ?? res.data;
            
            if (mealData) {
              console.log("Updating State with:", mealData);
              setData((prev) => ({
                ...prev,
                food_name: mealData.food_name,
                calorie: mealData.calorie || 0,
                protein: mealData.protein || 0,
                carbs: mealData.carbs || 0,
                fat: mealData.fat || 0,
              }));
  
              console.log("State Updated:", mealData);
  
              // Post data to DB if image URL is available
              if (url) {
                mealData.food_name !=="นี่ไม่ใช่อาหาร" ? (
                  postToDB(url, mealData.food_name, mealData.calorie, mealData.protein, mealData.carbs, mealData.fat)
                ):(
                  setWaiting(false)
                )
              }
            } else {
              console.warn("Meal data is null or undefined!");
            }
          } catch (apiError) {
            console.error("Error in API request:", apiError);
          }
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Get AI Fail:", err);
    }
  };
  
  // Debug state updates
  useEffect(() => {
    console.log("State Updated:", data);
  }, [data]);
  
  
  
  

  const postToDB = async (image_url:string ,Menu:string, Calorie: number, Protein: number, Carbs: number, Fat: number): Promise<void> => {

    console.log('image_url : ',image_url);
    try {
      const response = await axios.post(`${SERVER_URL}/meal/add`, {
        meal_date:new Date(),
        food_name:Menu,
        image_url:image_url,
        portion:detail,
        calorie:Calorie || 0,
        protein:Protein || 0,
        carbs:Carbs || 0,
        fat:Fat || 0,
        createByAI:true
      });

      let data = response.data

      setStep(3)

    } catch (err) {
      console.error('post to DB fail:', err);
    } finally {
      setWaiting(false)
    }

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
                {permission && permission.granted?(
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
                ):(
                  <View style={styles.camera} className='bg-gray'/>
                )}
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
                        <Text className='w-fit text-subText text-heading3 font-notoMedium'>Add other food</Text>
                      </TouchableOpacity>
                  </View>
                </View>
                <View className='w-full flex-row'>
                  <View className='grow justify-center'>
                    <Text className='text-heading font-noto'>{data.food_name}</Text>
                    {detail &&
                      <Text className='text-subText font-noto -translate-y-1'>{detail}</Text>
                    }
                  </View>
                  <View className='flex-row gap-1 items-end'>
                    <Text className='text-title font-notoMedium text-primary'>{data.calorie}</Text>
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
                          <Text className='text-heading font-notoMedium w-[8vw]'>{data.carbs}</Text>
                        </View>
                        <Text className='text-body text-subText'>grams</Text>
                      </View>
                      <View className='flex-row gap-2 items-end'>
                        <Text className='text-body text-subText w-[14vw]'>Protein</Text>
                        <View style={{transform:[{ translateY: 6 }]}}>
                          <Text className='text-heading font-notoMedium w-[8vw]'>{data.protein}</Text>
                        </View>
                        <Text className='text-body text-subText'>grams</Text>
                      </View>
                    </View>
                    <View className='flex-row gap-2 items-end'>
                      <Text className='text-body text-subText w-[14vw]'>Fat</Text>
                      <View style={{transform:[{ translateY: 6 }]}}>
                        <Text className='text-heading font-notoMedium w-[8vw]'>{data.fat}</Text>
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
  food_name:'กะเพราไก่',
  portion:'พิเศษ เพิ่มไข่ดาว',
  calorie:124,
  image:'',
  carbs:45,
  protein:12,
  fat:9
}

const styles = StyleSheet.create({
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