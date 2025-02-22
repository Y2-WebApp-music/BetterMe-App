import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import BackButton from '../../components/Back'
import BottomModal from '../../components/modal/BottomModal'
import PickDateModal from '../../components/modal/PickDateModal'
import PickNumberModal from '../../components/modal/PickNumberModal'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../../components/auth/firebaseConfig'
import axios from 'axios'
import { useAuth } from '../../context/authContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SERVER_URL } from '@env'
import { UserData } from '../../types/user'
import { useTheme } from '../../context/themeContext'
import GenderModal from '../../components/modal/GenderModal'
import ActivityModal from '../../components/modal/ActivityModal'


type UserProp = {
  birth:Date,
  gender:number,
  weight:number,
  height:number,
  activity:number,
}

const Register = () => {

  const { colors } = useTheme();
  const { setUser } = useAuth();

  const [form, setForm] = useState<UserProp>({
    birth: new Date(),
    gender: 0,
    weight: 0,
    height: 0,
    activity: 0,
  });

  // useEffect(() =>{
  //   console.log('form =>',form);
  // },[form])

  const progress2 = useRef(new Animated.Value(0)).current;

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
      Animated.timing(progress2, {
        toValue: calculateStep2Progress(),
        duration: 300,
        useNativeDriver: false,
      }).start();
  }, [form]);


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

  // Upload data to DB
  const handleSubmit = async () => {
    if (form.gender && form.weight && form.height && form.activity !== 0) {
      try {
        const firebaseUser:User = await new Promise((resolve, reject) => {
          onAuthStateChanged(auth, (user) => {
            if (user) resolve(user);
            else reject('No user authenticated');
          });
        });

        const response = await axios.post(`${SERVER_URL}/user/register`, {
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName,
          profile_img: firebaseUser.photoURL,
          birth_date: form.birth,
          gender: form.gender,
          weight: form.weight,
          height: form.height,
          activity: form.activity,
        });

        const { _id, birth_date, gender, weight, height, activity, calorie_need } = response.data.user;
        const serverToken = response.data.token;
        // const { birth_date, gender, weight, height, activity, calorie_need } = response.data.user;

        const extendedUser: UserData = {
          ...firebaseUser,
          _id,
          serverToken,
          birth_date,
          gender,
          weight,
          height,
          activity,
          calorie_need,
        };

        // const res = response.data;
        // const extendedUser: UserData = { ...firebaseUser, ...res };
        setUser(extendedUser)
        await AsyncStorage.setItem('@user', JSON.stringify(extendedUser));
        router.replace('/(tabs)/home');
      } catch (error: any) {
        setErr(error.message.replace('Firebase: ', ''));
      }
    } else {
      setErr('Please complete the form');
    }
  };


  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
      <View className='w-[92%] flex items-start mt-4'>
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
                <TouchableOpacity  className='flex justify-center items-center'>
                  <Text style={{color:colors.primary}}>personal data</Text>
                  <View style={{backgroundColor:colors.primary}} className={`h-2 w-2 rounded-full`}></View>
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
                  <PickDateModal value={form.birth} isOpen={dateModal} setIsOpen={setDateModal} setDate={updateDate} maximumDate={true} minimumDate={false}/>
                  <PickNumberModal setNumber={updateWeight} isOpen={weightModal} setIsOpen={setWeightModal} title={'Select Weight'} unit={'kg'} min={28} max={150} start={40} dotMax={10} />
                  <PickNumberModal setNumber={updateHeight} isOpen={heightModal} setIsOpen={setHeightModal} title={'Select Height'} unit={'cm'} min={126} max={210} start={150} dotMax={10} />

                  {err && <Text className='text-red text-detail mt-1'>{err}</Text>}
                </View>

            </View>

            <View className='flex gap-6 w-full'>
                <View className='w-full flex-row p-1 justify-end'>
                  <View className='grow'></View>
                  <TouchableOpacity onPress={handleSubmit} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
                    <Text className='w-fit text-white text-heading2 font-notoMedium'>Register</Text>
                  </TouchableOpacity>
                </View>
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