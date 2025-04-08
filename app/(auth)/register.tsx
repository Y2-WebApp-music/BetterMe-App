import { router } from 'expo-router';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../../components/Back';
import FormInput from '../../components/FormInput';
import BottomModal from '../../components/modal/BottomModal';
import PickDateModal from '../../components/modal/PickDateModal';
import PickNumberModal from '../../components/modal/PickNumberModal';
import { LeftArrowIcon } from '../../constants/icon';

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, firebaseStorage } from '../../components/auth/firebaseConfig';
import { useAuth } from '../../context/authContext';
import { activity, gender, UserData } from '../../types/user';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ActivityModal from '../../components/modal/ActivityModal';
import GenderModal from '../../components/modal/GenderModal';
import { useTheme } from '../../context/themeContext';

type UserProp = {
  username:string,
  email:string,
  password:string,
  confirmPassword:string,
  birth:Date,
  gender:number,
  weight:number,
  height:number,
  activity:number,
}

const screenWidth = Dimensions.get('window').width;

const Register = () => {

  const { colors } = useTheme();
  const { setUser } = useAuth()

  const [form, setForm] = useState<UserProp>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birth: new Date(),
    gender: 0,
    weight: 0,
    height: 0,
    activity: 0,
  });
  const [creating, setCreating] = useState(false)

  // useEffect(() =>{
  //   console.log('form =>',form);
  // },[form])

  const [step,setStep] = useState(1)
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;

  const calculateStep1Progress = () => {
    let percentage = 0;
    if (form.username) percentage += 25;
    if (form.email) percentage += 25;
    if (form.password) percentage += 25;
    if (form.confirmPassword) percentage += 25;
    return percentage;
  };

  const calculateStep2Progress = () => {
    let percentage = 0;
    if (form.birth) percentage += 20;
    if (form.gender) percentage += 20;
    if (form.weight) percentage += 20;
    if (form.height) percentage += 20;
    if (form.activity) percentage += 20;
    return percentage;
  };

  useEffect(() => {
    setErr('')
  },[form])

  useEffect(() => {
    if (step === 1) {
      Animated.timing(progress1, {
        toValue: calculateStep1Progress(),
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else if (step === 2) {
      Animated.timing(progress2, {
        toValue: calculateStep2Progress(),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [form, step]);

  const Step1Width = progress1.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const Step2Width = progress2.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const [dateModal,setDateModal] = useState(false)
  const updateDate = (date: Date) => {
    setForm((prevForm) => ({
      ...prevForm,
      birth: date,
    }));
  };

  const [weightModal,setWeightModal] = useState(false)
  const updateWeight = (weight: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      weight: weight,
    }));
  };

  const [heightModal,setHeightModal] = useState(false)
  const updateHeight = (height: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      height: height,
    }));
  };

  const [activityModal,setActivityModal] = useState(false)
  const updateActivity = (id:number) => {
    setForm((prevForm) => ({
      ...prevForm,
      activity: id,
    }));
    setActivityModal(false)
  }

  const [genderModal,setGenderModal] = useState(false)
  const updateGender = (id:number) => {
    setForm((prevForm) => ({
      ...prevForm,
      gender: id,
    }));
    setGenderModal(false)
  }

  const [err, setErr] = useState<string>('')
  const checkPassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (form.email === '') {
      setErr('Please give your email');
    } else if (!emailRegex.test(form.email)) {
      setErr('Please enter a valid email');
    } else if (form.password.length < 6) {
      setErr('Password must be at least 6 characters');
    } else if (form.password !== form.confirmPassword) {
      setErr('Password and confirm password do not match');
    } else if (form.username === '') {
      setErr('Please give username');
    } else {
      setStep(2);
    }
  };

  // Create User and Upload photo to Firebase
  const handleSubmit = async () => {
    console.warn('Creating your account....');
    
    if (form.gender && form.weight && form.height && form.activity != 0){
      let downloadURL:string | null = null;
      const metadata = {
        contentType: 'image/jpeg',
      }
      setCreating(true)
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password,
        )
        const user = userCredential.user
        console.log('==== userCredential createUserWithEmailAndPassword..... =====\n',user);

        const imageAsset = Asset.fromModule(
          form.gender === 1
            ? require('../../assets/maleAvatar.png')
            : require('../../assets/femaleAvatar.png')
        );
        console.log('imageAsset....',imageAsset);
        await imageAsset.downloadAsync();

        const imagePath = imageAsset.localUri;

        // Check if the image is available
        console.log('imagePath....',imagePath);
        if (imagePath) {
          // Read the file as Base64
          const fileUri = await FileSystem.readAsStringAsync(imagePath, { encoding: FileSystem.EncodingType.Base64 });
          const fileBlob = await fetch(`data:image/png;base64,${fileUri}`).then((res) => res.blob());

          const storageRef = ref(firebaseStorage, `avatar/${user.uid}.png`);
          const uploadTask = await uploadBytes(storageRef, fileBlob, metadata);
          downloadURL = await getDownloadURL(uploadTask.ref);
          console.log('Upload Complete', downloadURL);
        }

        console.log('updateProfile....');
        await updateProfile(user, {
          displayName:form.username,
          photoURL: downloadURL || null,
        })
        console.warn('Firebase Auth complete....');

        const response = await axios.post(`${SERVER_URL}/user/register`, {
          firebase_uid: user.uid,
          email: form.email,
          username: form.username,
          profile_img: downloadURL,
          birth_date: form.birth,
          gender: form.gender,
          weight: form.weight,
          height: form.height,
          activity: form.activity,
        });

        // const res = response.data;
        // const extendedUser: UserData = { ...user, ...res };
        console.log('Create User \n',response.data.user);
        console.log('User token \n',response.data.token);
        
        const { _id, birth_date, gender, weight, height, activity, calorie_need } = response.data.user;
        const serverToken = response.data.token;

        const extendedUser: UserData = {
          ...user,
          _id,
          serverToken,
          birth_date,
          gender,
          weight,
          height,
          activity,
          calorie_need,
        };
        await AsyncStorage.setItem('@user', JSON.stringify(extendedUser));
        setUser(extendedUser)
      } catch (error: any) {
        console.error('Register failed',error)
        const errorMessage = error.message.replace('Firebase: ', '')
        setErr(errorMessage)
      } finally {
        setCreating(false)
        router.replace('/(tabs)/home');
      }
    } else {
      setErr('please complete form')
    }
  }

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
      <View className='w-[92%] flex items-start mt-4'>
        <BackButton goto={'/welcome'}/>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <ScrollView
          className='w-[92%] h-full'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', }}
          showsVerticalScrollIndicator={false}
          >
          {!creating? (
          <View className='min-h-[70vh] w-full flex justify-start items-center'>

            <View className='w-full'>
              <Text className='text-[40px] text-primary font-notoMedium'>Better Me</Text>
              <Text className='text-heading2 text-primary font-noto -translate-y-2'>ชีวิตดีๆที่ลงตัว</Text>

              <View className='overflow-hidden rounded-full'>
                {/* <Image
                  style={styles.image}
                  source={photo}
                  contentFit="cover"
                  transition={1000}
                /> */}
              </View>

            </View>

            <View className='w-full mt-10' style={{paddingBottom: 20}} >
              <Text className='text-heading text-primary font-notoMedium'>Welcome to our app</Text>


              <View className='w-full flex flex-row justify-end items-end gap-2 mt-2'>
                <TouchableOpacity  onPress={()=>{setStep(1)}} className='flex justify-center items-center'>
                  <Text style={{color:step === 1? colors.primary:colors.subText}}>user info</Text>
                  <View style={{backgroundColor:step === 1?colors.primary:colors.darkGray}} className={`h-2 w-2 rounded-full`}></View>
                  <View className='relative w-28 h-2 mt-1'>
                    <View style={{backgroundColor:colors.darkGray}} className={`absolute top-0 w-full h-2 rounded-full`}></View>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        top: 0,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.primary,
                        width: Step1Width,
                      }}
                    ></Animated.View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>{setStep(2)}} className='flex justify-center items-center'>
                  <Text style={{color:step === 2? colors.primary:colors.subText}}>personal data</Text>
                  <View style={{backgroundColor:step === 2?colors.primary:colors.darkGray}} className={`h-2 w-2 rounded-full`}></View>
                  <View className='relative w-28 h-2 mt-1'>
                    <View style={{backgroundColor:colors.darkGray}} className={`absolute top-0 w-full h-2 rounded-full`}></View>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        top: 0,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:  colors.primary,
                        width: Step2Width,
                      }}
                    ></Animated.View>
                  </View>
                </TouchableOpacity>
              </View>

              {step === 1 ?(
                <View className=''>
                  <FormInput
                    name='username'
                    value={form.username}
                    handleChange={(e:string)=>setForm({ ...form,username: e})}
                    keyboardType="default"
                  />
                  <FormInput
                    name='email'
                    value={form.email}
                    handleChange={(e:string)=>setForm({ ...form,email: e})}
                    keyboardType="email-address"
                  />
                  <FormInput
                    name='password'
                    value={form.password}
                    handleChange={(e:string)=>setForm({ ...form,password: e})}
                    keyboardType="password"
                  />
                  <FormInput
                    name='confirm password'
                    value={form.confirmPassword}
                    handleChange={(e:string)=>setForm({ ...form,confirmPassword: e})}
                    keyboardType="password"
                  />
                  {err && <Text className='text-red text-detail mt-1'>{err}</Text>}
                </View>
              ):step === 2 && (
                <View className='flex flex-col'>
                  <View className='w-full mt-2'style={{marginTop: 10}}>
                    <Text style={{color:colors.subText}} className='text-detail'>date of birth</Text>
                    <TouchableOpacity
                      onPress={()=>{setDateModal(true)}}
                      className='w-full h-[5vh] p-2 flex justify-center border border-primary rounded-normal'
                    >
                      <Text className='flex-1 text-primary text-center font-notoMedium text-heading2'>
                        {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.birth)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className='flex flex-row gap-2 h-max w-full justify-center'>
                    <View className='w-[36%] mt-2'>
                      <Text style={{color:colors.subText}} className='text-detail text-center'>gender</Text>
                      <TouchableOpacity
                        onPress={()=>{setGenderModal(true)}}
                        className={`border  w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                        style={{borderColor:form.gender===0 ?colors.darkGray:colors.primary}}
                      >
                        <Text className={`${form.gender === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                          {form.gender ? gender.find(a => a.id === form.gender)?.gender : ''}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className='w-[30%] mt-2'>
                      <Text style={{color:colors.subText}} className='text-detail text-center'>weight</Text>
                      <TouchableOpacity
                        onPress={()=>{setWeightModal(true)}}
                        className={`border ${form.weight === 0? 'border-gray':'border-primary'} w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                        style={{borderColor:form.weight===0 ?colors.darkGray:colors.primary}}
                      >
                        <Text className={`${form.weight === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                          {form.weight}
                        </Text>
                        <Text style={{color:colors.subText}} className=' -translate-y-1'>kg</Text>
                      </TouchableOpacity>
                    </View>

                    <View className='w-[30%] mt-2'>
                      <Text style={{color:colors.subText}} className='text-detail text-center'>height</Text>
                      <TouchableOpacity
                        onPress={()=>{setHeightModal(true)}}
                        className={`border w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                        style={{borderColor:form.height===0 ?colors.darkGray:colors.primary}}
                      >
                        <Text className={`${form.height === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                          {form.height}
                        </Text>
                        <Text style={{color:colors.subText}} className='-translate-y-1'>cm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className='w-full mt-2'style={{marginTop: 10}}>
                    <Text style={{color:colors.subText}} className='text-detail'>your activity</Text>
                    <TouchableOpacity
                      onPress={()=>{setActivityModal(true)}}
                      className={`w-fit p-2 flex flex-row justify-center items-end border rounded-normal`}
                      style={{borderColor:form.activity===0 ?colors.darkGray:colors.primary}}
                    >
                      <Text style={{color:form.activity===0 ? colors.subText:colors.primary}} className={`flex-1  text-center font-notoMedium text-heading2`}>
                        {form.activity ? activity.find(a => a.id === form.activity)?.title : 'Select an Activity'}
                      </Text>
                    </TouchableOpacity>
                    <Text style={{color:colors.subText}} className='text-detail pl-2'>
                      {form.activity ? activity.find(a => a.id === form.activity)?.description : ''}
                    </Text>
                  </View>

                  <ActivityModal userActivity={form.activity} update={updateActivity} activityModal={activityModal} setActivityModal={setActivityModal}/>
                  <GenderModal userGender={form.gender} update={updateGender} genderModal={genderModal} setGenderModal={setGenderModal}/>

                  {Platform.OS === "android" ?(
                    dateModal &&
                    <RNDateTimePicker
                      display="spinner"
                      mode="date"
                      value={form.birth}
                      minimumDate={new Date('1950, 0, 1')}
                      maximumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setDateModal(!dateModal);
                          updateDate(selectedDate);
                        }
                      }}
                      style={{}}
                      locale="en-Gn"
                      themeVariant='light'
                    />
                  ):(
                    <PickDateModal value={form.birth} isOpen={dateModal} setIsOpen={setDateModal} setDate={updateDate} maximumDate={true} minimumDate={false}/>
                  )}
                  <PickNumberModal setNumber={updateWeight} isOpen={weightModal} setIsOpen={setWeightModal} title={'Select Weight'} unit={'kg'} min={28} max={150} start={40} dotMax={10} />
                  <PickNumberModal setNumber={updateHeight} isOpen={heightModal} setIsOpen={setHeightModal} title={'Select Height'} unit={'cm'} min={126} max={210} start={150} dotMax={10} />

                  {err && <Text className='text-red text-detail mt-1'>{err}</Text>}
                </View>

              )}
            </View>

            <View className='flex gap-6 w-full'>
              {step === 1 ?(
                <View className='w-full p-1 items-end'>
                  <TouchableOpacity  onPress={checkPassword} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
                    <Text className='w-fit text-white text-heading2 font-notoMedium'>Next</Text>
                  </TouchableOpacity>
                </View>
              ):(
                <View className='w-full flex-row p-1 justify-end'>
                  <TouchableOpacity onPress={()=>{setStep(1)}} style={{backgroundColor:colors.darkGray}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 pl-2 pr-4'>
                    <LeftArrowIcon width={14} height={14} color={"white"} />
                    <Text className='w-fit text-white text-heading2 font-notoMedium'>Back</Text>
                  </TouchableOpacity>
                  <View className='grow'></View>
                  <TouchableOpacity onPress={handleSubmit} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
                    <Text className='w-fit text-white text-heading2 font-notoMedium'>Register</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

          </View>
          ):(
            <View className='min-h-[10vh] w-full flex justify-start items-center'>
              <Text className='font-notoMedium text-subTitle animate-pulse text-primary'>Creating your account</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    width:screenWidth * 0.2,
    height:screenWidth * 0.2,
    alignContent:'center',
  },
});

export default Register