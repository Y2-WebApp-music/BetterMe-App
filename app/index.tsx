import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from 'react-native';
import FormInput from '../components/FormInput';
import { useState } from 'react';
import { GoogleIcon } from '../constants/icon';

export default function App() {

  const [form,setForm]= useState({
    username:'',
    password:''
  })

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
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
          <View className='min-h-[85vh] w-full flex justify-center items-center'>

            <View className='w-full'>
              <Text className='text-[40px] text-primary font-notoMedium'>Better Me</Text>
              <Text className='text-heading2 text-primary font-noto -translate-y-2'>ชีวิตดีๆที่ลงตัว</Text>
            </View>

            <View className='w-full mt-20' style={{paddingBottom: 20}} >
              <Text className='text-heading text-primary font-notoMedium'>Welcome back</Text>
              <FormInput
                name='email / username'
                value={form.username}
                handleChange={(e:string)=>setForm({ ...form,username: e})}
                keyboardType="default"
              />
              <FormInput
                name='password'
                value={form.password}
                handleChange={(e:string)=>setForm({ ...form,password: e})}
                keyboardType="password"
              />
              <View className='w-full flex items-end mt-1'>
                <Link href="./auth/forgetPassword" relativeToDirectory className='text-subText'>forget password?</Link>
              </View>
            </View>

            <View className='flex gap-6 mt-6'>
              <View className='flex flex-row items-center justify-center rounded-full p-1 px-4 bg-primary'>
                <Text className='text-white text-heading2 font-notoMedium'>Login</Text>
              </View>
              <Text className='text-subText'>Or continue with</Text>
              <View className='flex flex-row items-center justify-center border border-gray rounded-full p-2 px-4'>
                <GoogleIcon width={26} height={26}/>
                <Text>Google</Text>
              </View>
            </View>

            <View className='w-full flex justify-start items-start mt-16'>
              <Text className='text-subText'>Don’t you have an account?</Text>
              <Link href="./auth/register" relativeToDirectory className='text-primary text-heading2 font-notoSemiBold'>Create your account</Link>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}