import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import FormInput from '../components/FormInput';
import { useState } from 'react';

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
              <Text className='text-heading text-primary font-noto'>Welcome back</Text>
              <FormInput
                name='email/username'
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
              <View className='w-full flex items-end'>
                <Link href="./auth/forgetPassword" relativeToDirectory className='text-subText underline'>forget password?</Link>
              </View>
            </View>

            <View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
