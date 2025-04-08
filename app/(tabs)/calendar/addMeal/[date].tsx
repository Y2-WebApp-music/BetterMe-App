import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Keyboard } from 'react-native';
import BackButton from '../../../../components/Back';
import { router, useLocalSearchParams } from 'expo-router';
import { CloseIcon, GalleryIcon } from '../../../../constants/icon';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '../../../../components/FormInput';
import { Meal, MealAi } from '../../../../types/food';
import { useAuth } from '../../../../context/authContext';
import RainbowButton from '../../../../components/RainbowButton';
import NumberInput from '../../../../components/NumberInput';
import { CameraView, useCameraPermissions } from 'expo-camera';
import PickDateTimeModal from '../../../../components/modal/PickDateTimeModal';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseStorage } from '../../../../components/auth/firebaseConfig';
import { format } from 'date-fns';
import { SERVER_URL } from '@env';
import axios from 'axios';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../../../../context/themeContext';
import WarningModal from '../../../../components/modal/WarningModal';

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

  const { date } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth()

  const [photo, setPhoto] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView | null>(null);
  const [form, setForm] = useState<MealProp>({
    create_by:user?._id || '',
    meal_date:new Date(date.toString()),
    food_name:'',
    portion:'',
    image_url:'',
    calorie:0,
    protein :0,
    carbs:0,
    fat:0,
    createByAI:false
  });
  const [openModal,setOpenModal] = useState(false)
  const [aiCreating, setAiCreating] = useState(false)
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission === null || !permission.granted) {
      const timer = setTimeout(() => {
        requestPermission();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [permission, requestPermission]);

  const [countdown, setCountdown] = useState(3);
  const [waiting, setWaiting] = useState(false)
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);

  const handleCancel = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdown(3);
      setWaiting(false);
      console.log('creation canceled');
    }
  };

  // useEffect(()=>{
  //   console.log('form \n',form);
  // },[form])

  const removeImage = () =>{
    setPhoto(null)
    setDownloadURL('')
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync()
        if (data) {
          setPhoto(data.uri);
        }
      } catch(error) {

      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      selectionLimit: 10,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const cameraSize = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [screenWidth * 0.78, screenWidth * 0.5],
    extrapolate: 'clamp',
  });

  const [err, setErr] = useState('')
  const [errTitle, setErrTitle] = useState('Please complete detail')
  const [warning, setWarning] = useState(false)

  const handleSubmit = async () => {

    if (form.food_name === '') {
      console.log('Food Name is required');
      setErrTitle('Please complete detail')
      setErr('Food Name is required');
      setWarning(true)
      return
    }
    if (form.protein === 0 && form.fat === 0 && form.carbs === 0) {
      console.log('At least one nutrients is required');
      setErrTitle('Please complete detail')
      setErr('protein, fat or carbs is empty');
      setWarning(true)
      return
    }

    let counter = 3;
      setCountdown(counter)
      setWaiting(true);

      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);

        if (counter <= 0) {
          clearInterval(interval);
          postToDB()
        }
      }, 1000);
      setCountdownInterval(interval)

  };

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

  useEffect(()=>{
    console.log('downloadURL : ', downloadURL);
  },[downloadURL])

  const postToDB = async () => {
    try {

      console.log('postToDB() USE ');
      const url = await handleImageUpload();
      
      if (url && user && form.meal_date) {
        console.log('Upload to DB');

        const response = await axios.post(`${SERVER_URL}/meal/add`, {
          meal_date:form.meal_date,
          food_name:form.food_name,
          image_url:url,
          portion:form.portion,
          calorie:form.calorie,
          protein:form.protein,
          carbs:form.carbs,
          fat:form.fat,
          createByAI:form.createByAI,
        });

        const data = response.data
        console.log('data ',data);

        setWaiting(false)

      }
    } catch (error) {
      console.error('Upload failed', error);
    }

    router.replace(`calendar/weekCalendar`)
  }

  const getMealByAI = async () => {
    setAiCreating(true)
      try {
        if (!photo) return;
    
        // Compress and convert to blob
        const compressedImage = await ImageManipulator.manipulateAsync(photo, [], { compress: 0.5 });
        const response = await fetch(compressedImage.uri);
        const blob = await response.blob();
    
        console.log('type ', blob.type);
        console.log('size ', blob.size);
    
        // blob to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          if (reader.result && typeof reader.result === 'string') {
            const base64Image = reader.result
    
            const res = await axios.post(`${SERVER_URL}/meal/by-ai`, {
              image: base64Image,
              portion: form.portion,
            });

            if (res.data.message === "Error getting result from AI, please try again.") {
              setErrTitle('Getting result Failed')
              setErr('Error getting result from AI, please try again.');
              setWarning(true)
              setForm({
                ...form,
                food_name: '',
                calorie : 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                createByAI:false,
              })
              setAiCreating(false)
              return
            }

            let mealData:MealAi | null = res.data
            console.log('mealData ',mealData);
            
            mealData && setForm({
              ...form,
              food_name: mealData.food_name,
              calorie : mealData.calorie || 0,
              protein: mealData.protein || 0,
              carbs: mealData.carbs || 0,
              fat: mealData.fat || 0,
              createByAI:true,
            })

            setAiCreating(false)

          }
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Get Ai Fail:', err);
      }
  }
  

  const [modalStep, setModalStep] = useState<"date" | "time">("date");

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-start items-center font-noto">
      {!waiting?(
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
      >
        <View className="w-[92%] mt-4 z-20">
          <View className="w-full">
            <View className="max-w-[14vw]">
              <BackButton />
            </View>
          </View>
          <View>
          <View className="flex flex-row gap-2 items-center mt-2">
            <View className="grow">
              <Text className="text-subTitle text-primary font-notoMedium">Add Meal</Text>
            </View>
            {photo &&
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full"
              >
                <Text className="text-heading2 text-white font-notoMedium">Add meal</Text>
              </TouchableOpacity>
            }
          </View>
          {!photo &&
            <Text style={{color:colors.subText}} className=' font-notoLight'>Snap a photo to identify your dishes or choose from gallery. Learn nutritional facts</Text>
          }
          </View>
        </View>

        {/* Photo white Background Behind */}
        <Animated.View
          style={{
            position: 'absolute',
            top: photo ? screenWidth * 0.22 : screenWidth * 0.32,
            left: 0,
            right: 0,
            height: cameraSize,
            backgroundColor: colors.background,
            zIndex: 1,
          }}
          onStartShouldSetResponder={() => {
            Keyboard.dismiss();
            return false;
          }}
        />

        {/* Photo Container */}
        <Animated.View
          style={{
            position: 'absolute',
            top: photo ? screenWidth * 0.22 : screenWidth * 0.32,
            width: photo ? cameraSize : screenWidth * 0.92,
            height: photo ? cameraSize : screenWidth * 0.92,
            zIndex: 10,
            alignSelf: 'center',
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: photo ? 'transparent' : '#CFCFCF',
          }}
        >
          {!photo ? (
            permission && permission.granted?(
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
            )
          ) : (
            <View
              style={{ flex: 1 }}
              onStartShouldSetResponder={() => {
                Keyboard.dismiss();
                return false;
              }}
            >
              <Image
                source={{ uri: photo }}
                style={{ width: '100%', height: '100%' }}
              />
              <TouchableOpacity
                onPress={removeImage}
                className="h-11 w-11 rounded-full bg-primary justify-center items-center"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  padding: 8,
                  borderRadius: 20,
                }}
              >
                <CloseIcon width={34} height={34} color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Form Container */}
        {!photo ? (
          <View style={{ paddingTop: screenWidth }} className="w-full mt-10 justify-center items-center">
            <TouchableOpacity
              onPress={takePicture}
              className="bg-primary w-32 h-32 flex justify-center items-center rounded-full"
            >
              <Text className="text-heading2 text-white font-notoMedium">Capture</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.ScrollView
            className="w-[92%] h-auto pb-20 mt-2 relative"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              paddingTop: screenWidth * 0.8,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={20}
            showsVerticalScrollIndicator={false}
          >
            <View className="items-end justify-center flex-row">
              <View className='grow'>
                <Text className='text-heading font-notoMedium text-primary'>Meal detail</Text>
              </View>
              {aiCreating?(
                  <TouchableOpacity onPress={()=>setAiCreating(false)} style={{backgroundColor:colors.darkGray}} className='p-1 px-4 rounded-full justify-center items-center'>
                    <Text className='text-body text-white font-noto'>Cancel</Text>
                  </TouchableOpacity>
              ):(
                <RainbowButton text={'Auto fill with AI'} active={!!photo} handleClick={getMealByAI}/>
              )}
            </View>
            <View style={{transform:[{translateY:-4}]}}>
              <FormInput
                name={'Food Name'}
                value={form.food_name}
                handleChange={(e: string) => setForm({ ...form, food_name: e, createByAI:false })}
                keyboardType={'default'}
              />
              <FormInput
                name={'Portion'}
                value={form.portion}
                handleChange={(e: string) => setForm({ ...form, portion: e })}
                keyboardType={'default'}
              />
              <View className="flex-row gap-4">
                <View className="grow flex-row items-end gap-1">
                  <View className='grow'>
                    <NumberInput
                      name={'protein'}
                      value={form.protein}
                      handleChange={(e: number) => setForm({
                        ...form,
                        protein:e,
                        calorie:((e*4) + (form.carbs*4) + (form.fat*9)),
                        createByAI:false
                      })}
                    />
                  </View>
                  <Text style={{color:colors.subText}} className='text-detail'>grams</Text>
                </View>
                <View className="grow flex-row items-end gap-1">
                  <View className='grow'>
                    <NumberInput
                      name={'Carbs'}
                      value={form.carbs}
                      handleChange={(e: number) => setForm({
                        ...form,
                        carbs:e,
                        calorie:((form.protein*4) + (e*4) + (form.fat*9)),
                        createByAI:false
                      })}
                    />
                  </View>
                  <Text style={{color:colors.subText}} className='text-detail'>grams</Text>
                </View>
                <View className="grow flex-row items-end gap-1">
                  <View className='grow'>
                    <NumberInput
                      name={'fat'}
                      value={form.fat}
                      handleChange={(e: number) => setForm({
                        ...form,
                        fat:e,
                        calorie: (form.protein * 4) + (form.carbs * 4) + (e * 9),
                        createByAI:false
                      })}
                    />
                  </View>
                  <Text style={{color:colors.subText}} className='text-detail'>grams</Text>
                </View>
              </View>

              <View style={{marginTop: 0}} className='flex-row gap-4'>
                <View className='mt-2 grow' style={{marginTop: 7}}>
                  <Text style={{color:colors.subText}} className=' text-detail'>total calorie</Text>
                  <View className='flex-row gap-1 items-end'>
                    <Text className='text-primary text-center font-notoMedium text-subTitle'> {form.calorie} </Text>
                    <View style={{transform:[{translateY:-8}]}}>
                      <Text style={{color:colors.subText}} className='text-body '>Cal</Text>
                    </View>
                  </View>
                </View>
                <View className='grow mt-2'>
                  <Text style={{color:colors.subText}} className=' text-detail'>Meal time</Text>
                  <TouchableOpacity
                    onPress={()=>{setOpenModal(true)}}
                    className='w-full h-[5vh] p-2 flex justify-center border border-primary rounded-normal'
                  >
                    <Text className='flex-1 text-primary text-center font-notoMedium text-heading3'>
                    {new Intl.DateTimeFormat('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(form.meal_date)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
            {aiCreating &&(
              <View style={{backgroundColor:colors.background}} className=' absolute bottom-0 w-full h-[31vh] flex-1 flex-col justify-center items-center flex gap-2 mt-2'>
                <View className='absolute top-0 z-10 w-full h-full justify-center items-center'>
                  <Text className=' text-subTitle text-primary animate-pulse font-notoMedium'> Creating </Text>
                </View>
                <View style={{backgroundColor:colors.gray}} className='w-full rounded-normal h-14 animate-pulse'/>
                <View style={{backgroundColor:colors.gray}} className='w-full rounded-normal h-14 animate-pulse'/>
                <View className='h-auto w-full flex-row gap-4'>
                  <View style={{backgroundColor:colors.gray}} className='grow rounded-normal h-14 animate-pulse'/>
                  <View style={{backgroundColor:colors.gray}} className='grow rounded-normal h-14 animate-pulse'/>
                  <View style={{backgroundColor:colors.gray}} className='grow rounded-normal h-14 animate-pulse'/>
                </View>
                <View className='h-auto w-full flex-row justify-between'>
                  <View style={{backgroundColor:colors.gray}} className='w-[25%] rounded-normal h-14 animate-pulse'/>
                  <View style={{backgroundColor:colors.gray}} className='w-[70%] rounded-normal h-14 animate-pulse'/>
                </View>
              </View>
            )}
          </Animated.ScrollView>
        )}
      </KeyboardAvoidingView>
      ):(<View className='flex-1 justify-center items-center'>
            <Text className='font-notoMedium text-title text-primary'>{countdown}</Text>
            <Text className='font-notoMedium text-subTitle animate-pulse text-primary'>Creating</Text>
            <TouchableOpacity onPress={handleCancel} style={{backgroundColor:colors.nonFocus}} className='mt-12 p-1 px-4 rounded-full justify-center items-center'>
              <Text className='text-white font-noto text-heading2'>Cancel</Text>
            </TouchableOpacity>
          </View>
      )}
      {Platform.OS === "android" ? openModal && (
                <>
                  {modalStep === "date" && (
                    <RNDateTimePicker display="spinner" mode="date" value={form.meal_date} maximumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setForm((prevForm) => ({
                            ...prevForm,
                            meal_date: selectedDate,
                          }));
                          setModalStep("time"); // Switch to the time picker
                        } else {
                          setOpenModal(false); // Close modal if canceled
                        }
                      }}
                      locale="en-Gn"
                      themeVariant="light"
                    />
                  )}
                  {modalStep === "time" && (
                    <RNDateTimePicker display="clock" mode="time" value={form.meal_date}
                      onChange={(event, selectedTime) => {
                        if (selectedTime) {
                          setForm((prevForm) => ({
                            ...prevForm,
                            meal_date: selectedTime,
                          }));
                        }
                        setOpenModal(false); // Close modal after selecting time
                        setModalStep("date"); // Reset step for next usage
                      }}
                      is24Hour={true}
                    />
                  )}
                </>
              ):(
                <PickDateTimeModal value={form.meal_date} isOpen={openModal} setIsOpen={()=>{setOpenModal(!openModal)}}
                  setDate={(date: Date) => {
                    setForm((prevForm) => ({
                      ...prevForm,
                      meal_date: date,
                  }))}
                } maximumDate={true} />
              )}
              <WarningModal
                title={errTitle}
                detail={err}
                isOpen={warning}
                setIsOpen={()=>setWarning(!warning)}
              />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: screenWidth * 0.92,
    height: screenWidth * 0.92,
    borderRadius: 12,
  },
});

export default AddMeal;