import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import FormInput from '../../components/FormInput'
import { Link } from 'expo-router'
import BackButton from '../../components/Back'

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

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <View className='w-[92%] flex items-start mt-4'>
        <BackButton/>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 5}
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
                <View className='flex justify-center items-center'>
                  <Text className={`text-primary`}>user info</Text>
                  <View className={`h-2 w-2 bg-primary rounded-full`}></View>
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
                </View>
                <View className='flex justify-center items-center'>
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
                </View>
              </View>

              {step === 1 ?(
                <View>
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
                </View>
              ):step === 2 && (
                <View>
                  {/* <FormInput
                    name='date of birth'
                    value={form.birth}
                    handleChange={(e:string)=>setForm({ ...form,birth: e})}
                    keyboardType="default"
                  />
                  <FormInput
                    name='gender'
                    value={form.gender}
                    handleChange={(e:string)=>setForm({ ...form,gender: e})}
                    keyboardType="default"
                  />
                  <FormInput
                    name='weight'
                    value={form.weight}
                    handleChange={(e:string)=>setForm({ ...form,weight: e})}
                    keyboardType="default"
                  />
                  <FormInput
                    name='height'
                    value={form.height}
                    handleChange={(e:string)=>setForm({ ...form,height: e})}
                    keyboardType="default"
                  />
                  <FormInput
                    name='your activity'
                    value={form.activity}
                    handleChange={(e:string)=>setForm({ ...form,activity: e})}
                    keyboardType="default"
                  /> */}
                </View>

              )}
            </View>

            <View className='flex gap-6'>
              {step === 1 ?(
                <TouchableOpacity  onPress={()=>{setStep(2)}} className='w-fit flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
                  <Text className='w-fit text-white text-heading2 font-notoMedium'>Next</Text>
                </TouchableOpacity>
              ):(
                <TouchableOpacity className='w-fit flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
                  <Text className='w-fit text-white text-heading2 font-notoMedium'>Register</Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Register