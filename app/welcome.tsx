import { Link, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FormInput from '../components/FormInput';
import { useEffect, useState } from 'react';
import { GoogleIcon } from '../constants/icon';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../components/auth/firebaseConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CLIENT_ID_IOS, CLIENT_ID_Android } from '@env';

export default function Welcome() {

  const [form,setForm]= useState({
    username:'',
    password:''
  })

  const [error, setError] = useState<string | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: CLIENT_ID_IOS,
    androidClientId: CLIENT_ID_Android,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {

          await AsyncStorage.setItem('@user', JSON.stringify(userCredential.user));

          router.replace('/(tabs)/home');
        })
        .catch((error) => {
          console.error(error);
          setError('Google login failed. Please try again.');
        });
    }
  }, [response]);

  const [err, setErr] = useState<string>('')
  const handleSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, form.username, form.password)
      router.replace('/(tabs)/home');
    } catch (error) {
      setErr('Email or password is wrong. Please try again.')
    }
  }

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                <Link href="/(auth)/forgetPassword" relativeToDirectory className='text-subText'>forget password?</Link>
              </View>
            </View>

            <View className='flex gap-6 mt-6'>
              <TouchableOpacity onPress={handleSubmit} className='flex flex-row items-center justify-center rounded-full p-1 px-4 bg-primary'>
                <Text className='text-white text-heading2 font-notoMedium'>Login</Text>
              </TouchableOpacity>
              <Text className='text-subText'>Or continue with</Text>
              <TouchableOpacity
                onPress={()=> promptAsync()}
                className='flex flex-row items-center justify-center border border-gray rounded-full p-2 px-4'
              >
                <GoogleIcon width={26} height={26}/>
                <Text>Google</Text>
              </TouchableOpacity>
            </View>

            <View className='w-full flex justify-start items-start mt-16'>
              <Text className='text-subText'>Don’t you have an account?</Text>
              <Link href="/(auth)/register" relativeToDirectory className='text-primary text-heading2 font-notoSemiBold'>Create your account</Link>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}