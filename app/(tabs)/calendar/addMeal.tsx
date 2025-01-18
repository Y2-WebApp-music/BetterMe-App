import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Keyboard } from 'react-native';
import BackButton from '../../../components/Back';
import { router } from 'expo-router';
import { CloseIcon, GalleryIcon } from '../../../constants/icon';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '../../../components/FormInput';
import { Meal } from '../../../types/food';
import { useAuth } from '../../../context/authContext';
import RainbowButton from '../../../components/RainbowButton';
import NumberInput from '../../../components/NumberInput';
import { CameraView } from 'expo-camera';
import PickDateTimeModal from '../../../components/modal/PickDateTimeModal';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseStorage } from '../../../components/auth/firebaseConfig';

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
  const scrollY = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView | null>(null);
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
  });

  const [openModal,setOpenModal] = useState(false)

  const removeImage = () =>{
    setPhoto(null)
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
    outputRange: [screenWidth * 0.86, screenWidth * 0.5],
    extrapolate: 'clamp',
  });

  const handleSubmit = async () => {
    let downloadURL: string | null = null;
    const metadata = {
      contentType: 'image/png',
    };

    try {
      if (photo && user) {
        const storageRef = ref(firebaseStorage, `meal/${user.uid}.png`);

        const response = await fetch(photo);
        const blob = await response.blob();

        const extension = photo.split('.').pop();
        const mimeType = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : 'image/png';

        const uploadTask = await uploadBytes(storageRef, blob, { ...metadata, contentType: mimeType });

        downloadURL = await getDownloadURL(uploadTask.ref);
        console.log('Upload Complete', downloadURL);
      }
    } catch (error) {
      console.error('Upload failed', error);
    }

    return downloadURL;
  };

  return (
    <SafeAreaView className="w-full h-full justify-start items-center bg-Background font-noto">
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
          <View className="flex flex-row gap-2 items-center mt-2">
            <View className="grow">
              <Text className="text-subTitle text-primary font-notoMedium">Add Meal</Text>
            </View>
            <TouchableOpacity
              onPress={() => {}}
              className="bg-primary flex-row gap-2 p-2 px-4 justify-center items-center rounded-full"
            >
              <Text className="text-heading2 text-white font-notoMedium">Add meal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photo white Background Behind */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 87,
            left: 0,
            right: 0,
            height: cameraSize,
            backgroundColor: '#fbffff',
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
            top: 87,
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
            <CameraView
              style={styles.camera}
              facing={'back'}
              ref={cameraRef}
            >
              <View className="w-full h-full p-2 justify-end items-end">
                <TouchableOpacity onPress={pickImage} className="h-12 w-12 rounded-normal bg-primary justify-center items-center">
                  <GalleryIcon width={30} height={30} color={'white'} />
                </TouchableOpacity>
              </View>
            </CameraView>
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
                className="h-12 w-12 rounded-full bg-primary justify-center items-center"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  padding: 8,
                  borderRadius: 20,
                }}
              >
                <CloseIcon width={24} height={24} color={'#FFFFFF'} />
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
            className="w-[92%] h-auto pb-20 mt-2"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              paddingTop: screenWidth * 0.87,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={20}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <FormInput
                name={'Food Name'}
                value={form.food_name}
                handleChange={(e: string) => setForm({ ...form, food_name: e })}
                keyboardType={'default'}
              />
              <FormInput
                name={'Portion'}
                value={form.portion}
                handleChange={(e: string) => setForm({ ...form, portion: e })}
                keyboardType={'default'}
              />
              <PickDateTimeModal
                value={form.meal_date}
                isOpen={openModal}
                setIsOpen={()=>{setOpenModal(!openModal)}}
                setDate={(date: Date) => {
                  setForm((prevForm) => ({
                    ...prevForm,
                    meal_date: date,
                }))}
                }
                maximumDate={true}
              />
              <View className='w-full mt-2'style={{marginTop: 10}}>
                    <Text className='text-subText text-detail'>Meal time</Text>
                    <TouchableOpacity
                      onPress={()=>{setOpenModal(true)}}
                      className='w-full h-[5vh] p-2 flex justify-center border border-primary rounded-normal'
                    >
                      <Text className='flex-1 text-primary text-center font-notoMedium text-heading2'>
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
              <View className="flex-row gap-2">
                <View className="grow">
                  <NumberInput
                    name={'Protein'}
                    value={form.protein}
                    handleChange={(e: number) => setForm({ ...form, protein: e })}
                  />
                </View>
                <View className="grow">
                  <NumberInput
                    name={'Carbs'}
                    value={form.carbs}
                    handleChange={(e: number) => setForm({ ...form, carbs: e })}
                  />
                </View>
                <View className="grow">
                  <NumberInput
                    name={'Fat'}
                    value={form.fat}
                    handleChange={(e: number) => setForm({ ...form, fat: e })}
                  />
                </View>
              </View>
              <View className="py-6">
                <RainbowButton text={'Auto fill with AI'} active={!!photo} />
              </View>
            </View>
          </Animated.ScrollView>
        )}
      </KeyboardAvoidingView>
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