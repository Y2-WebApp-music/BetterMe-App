import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import FormInput from '../components/FormInput';
import { useState } from 'react';

export default function App() {

  const [form,setForm]= useState({
    username:'',
    password:''
  })

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <ScrollView className='w-[92%] h-full'>
        <View className='min-h-[85vh] w-full flex justify-center items-center'>
          <View className='w-full'>
            <Text className='text-[40px] text-primary font-notoMedium'>Better Me</Text>
            <Text className='text-heading2 text-primary font-noto -translate-y-2'>ชีวิตดีๆที่ลงตัว</Text>
          </View>
          <View className='w-full mt-20'>
            <Text className='text-heading text-primary font-noto'>Welcome back</Text>
            <FormInput
              name='email/username'
              value={form.username}
              handleChange={(e:string)=>setForm({ ...form,username: e})}
              keyboardType="text"
            />
            <FormInput
              name='password'
              value={form.password}
              handleChange={(e:string)=>setForm({ ...form,password: e})}
              keyboardType="password"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
