import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import BackButton from '../../components/Back'
import FormInput from '../../components/FormInput'
import BottomModal from '../../components/modal/BottomModal'
import PickDateModal from '../../components/modal/PickDateModal'
import PickNumberModal from '../../components/modal/PickNumberModal'
import { LeftArrowIcon } from '../../constants/icon'

import { SERVER_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../components/auth/firebaseConfig'
import { useAuth, UserData } from '../../context/authContext'

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

const Register = () => {

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
    if (form.password === form.confirmPassword) {
      setStep(2)
    } else {
      setErr(`password and Confirm password is doesn't match`)
    }
  }

  // Create User and Upload data to Firebase
  const handleSubmit = async () => {
    if (form.gender && form.weight && form.height && form.activity != 0){
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password,
        )
        const user = userCredential.user

        await updateProfile(user, {
          displayName:form.username,
          photoURL: null,
        })
        await AsyncStorage.setItem('@user', JSON.stringify(userCredential.user));

        const userId = user.uid;
        console.log('userId :', userId);

        const response = await axios.post(`${SERVER_URL}/user/register`, {
          firebase_uid: user.uid,
          birth_date: form.birth,
          gender: form.gender,
          weight: form.weight,
          height: form.height,
          activity: form.activity,
        });

        const res = response.data;
        const extendedUser: UserData = { ...user, ...res };
        setUser(extendedUser)
        await AsyncStorage.setItem('@user', JSON.stringify(extendedUser));
        router.replace('/(tabs)/home');
      } catch (error: any) {
        const errorMessage = error.message.replace('Firebase: ', '')
        setErr(errorMessage)
      }
    } else {
      setErr('please complete form')
    }
  }

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
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
          <View className='min-h-[70vh] w-full flex justify-start items-center'>

            <View className='w-full'>
              <Text className='text-[40px] text-primary font-notoMedium'>Better Me</Text>
              <Text className='text-heading2 text-primary font-noto -translate-y-2'>ชีวิตดีๆที่ลงตัว</Text>
            </View>

            <View className='w-full mt-10' style={{paddingBottom: 20}} >
              <Text className='text-heading text-primary font-notoMedium'>Welcome to our app</Text>

              <View className='w-full flex flex-row justify-end items-end gap-2 mt-2'>
                <TouchableOpacity  onPress={()=>{setStep(1)}} className='flex justify-center items-center'>
                  <Text className={`${step === 1? "text-primary":"text-subText"}`}>user info</Text>
                  <View className={`${step === 1? "bg-primary":"bg-neutral-200"} h-2 w-2 rounded-full`}></View>
                  <View className='relative w-28 h-2 mt-1'>
                    <View className={`absolute top-0 w-full h-2 rounded-full bg-neutral-200`}></View>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        top: 0,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#1C60DE',
                        width: Step1Width,
                      }}
                    ></Animated.View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>{setStep(2)}} className='flex justify-center items-center'>
                  <Text className={`${step === 2? "text-primary":"text-subText"}`}>personal data</Text>
                  <View className={`${step === 2? "bg-primary":"bg-neutral-200"} h-2 w-2 rounded-full`}></View>
                  <View className='relative w-28 h-2 mt-1'>
                    <View className={`absolute top-0 w-full h-2 rounded-full bg-neutral-200`}></View>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        top: 0,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#1C60DE',
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
                    <Text className='text-subText text-detail'>date of birth</Text>
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
                      <Text className='text-subText text-detail text-center'>gender</Text>
                      <TouchableOpacity
                        onPress={()=>{setGenderModal(true)}}
                        className={`border ${form.gender === 0? 'border-gray':'border-primary'} w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                      >
                        <Text className={`${form.gender === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                          {form.gender ? gender.find(a => a.id === form.gender)?.gender : ''}
                        </Text>
                      </TouchableOpacity>

                    </View>
                    <View className='w-[30%] mt-2'>
                      <Text className='text-subText text-detail text-center'>weight</Text>
                      <TouchableOpacity
                        onPress={()=>{setWeightModal(true)}}
                        className={`border ${form.weight === 0? 'border-gray':'border-primary'} w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                      >
                        <Text className={`${form.weight === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                          {form.weight}
                        </Text>
                        <Text className='text-subText -translate-y-1'>kg</Text>
                      </TouchableOpacity>
                    </View>

                    <View className='w-[30%] mt-2'>
                      <Text className='text-subText text-detail text-center'>height</Text>
                      <TouchableOpacity
                        onPress={()=>{setHeightModal(true)}}
                        className={`border ${form.height === 0? 'border-gray':'border-primary'} w-fit p-2 flex flex-row justify-center items-end rounded-normal`}
                      >
                        <Text className={`${form.height === 0? 'text-subText':'text-primary'} flex-1 text-center font-notoMedium text-heading2`}>
                          {form.height}
                        </Text>
                        <Text className='text-subText -translate-y-1'>cm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className='w-full mt-2'style={{marginTop: 10}}>
                    <Text className='text-subText text-detail'>your activity</Text>
                    <TouchableOpacity
                      onPress={()=>{setActivityModal(true)}}
                      className={`${form.activity===0 ? 'border-gray' : 'border-primary'} w-fit p-2 flex flex-row justify-center items-end border rounded-normal`}
                    >
                      <Text className={`${form.activity===0 ? 'text-subText' : 'text-primary'} flex-1  text-center font-notoMedium text-heading2`}>
                        {form.activity ? activity.find(a => a.id === form.activity)?.title : 'Select an Activity'}
                      </Text>
                    </TouchableOpacity>
                    <Text className='text-subText text-detail pl-2'>
                      {form.activity ? activity.find(a => a.id === form.activity)?.description : ''}
                    </Text>
                  </View>

                  <BottomModal
                    isOpen={activityModal}
                    setIsOpen={setActivityModal}
                  >
                    <View className= 'w-full p-2 flex gap-2'>
                      <View className='w-full items-center justify-center'>
                          <Text className='text-heading2 py-2'>select your activity</Text>
                      </View>
                      {activity.map((activityItem) => (
                        <TouchableOpacity
                          key={activityItem.id}
                          onPress={() => updateActivity(activityItem.id)}
                          className={`${
                            activityItem.id === form.activity ? 'border-primary' : 'border-gray'
                          } rounded-normal border p-2`}
                        >
                          <Text
                            className={`${
                              activityItem.id === form.activity ? 'text-primary' : 'text-text'
                            } text-heading2 font-noto h-[3vh]`}
                          >
                            {activityItem.title}
                          </Text>
                          <Text className='text-subText'>{activityItem.description}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </BottomModal>

                  <BottomModal
                    isOpen={genderModal}
                    setIsOpen={setGenderModal}
                  >
                    <View className= 'w-full p-2 flex gap-2'>
                      <View className='w-full items-center justify-center'>
                          <Text className='text-heading2 py-2'>select gender</Text>
                      </View>
                      {gender.map((activityItem) => (
                        <TouchableOpacity
                          key={activityItem.id}
                          onPress={() => updateGender(activityItem.id)}
                          className={`${
                            activityItem.id === form.gender ? 'border-primary' : 'border-gray'
                          } rounded-normal border p-2`}
                        >
                          <Text
                            className={`${
                              activityItem.id === form.gender ? 'text-primary' : 'text-text'
                            } text-heading2 font-noto h-[3vh]`}
                          >
                            {activityItem.gender}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </BottomModal>

                  <PickDateModal value={form.birth} isOpen={dateModal} setIsOpen={setDateModal} setDate={updateDate} maximumDate={true}/>
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
                  <TouchableOpacity onPress={()=>{setStep(1)}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 pl-2 pr-4 bg-DarkGray'>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const gender = [
  {
    id:1,
    gender:'Male'
  },
  {
    id:2,
    gender:'Female'
  },
]

const activity = [
  {
    id:1,
    title:'Sedentary',
    description:'Very little physical activity.'
  },
  {
    id:2,
    title:'Lightly Active',
    description:'Light physical activity 1-3 days a week.'
  },
  {
    id:3,
    title:'Moderately active',
    description:'Regular moderate exercise 3-5 days a week.'
  },
  {
    id:4,
    title:'Very active',
    description:'Hard physical activity or exercise 6-7 days a week.'
  },
  {
    id:5,
    title:'Extra active',
    description:'Extremely high physical activity levels, often more than once per day.'
  },
]

export default Register