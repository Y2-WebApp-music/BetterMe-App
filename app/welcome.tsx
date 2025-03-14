import { CLIENT_ID_Android, CLIENT_ID_IOS } from '@env';
import * as Google from "expo-auth-session/providers/google";
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../components/auth/firebaseConfig';
import FormInput from '../components/FormInput';
import { GoogleIcon } from '../constants/icon';
import { useAuth } from '../context/authContext';
import { useTheme } from '../context/themeContext';

export default function Welcome() {

  const { colors } = useTheme();
  const { loginWithGoogle } = useAuth()

  const [form,setForm]= useState({
    email:'',
    password:''
  })

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: CLIENT_ID_IOS,
    androidClientId: CLIENT_ID_Android,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      console.log('loginWithGoogle press');

      loginWithGoogle(id_token)
    }
  }, [response]);

  const [err, setErr] = useState<string>('')
  const handleSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
    } catch (error) {
      console.log(error);
      setErr('Email or password is wrong. Please try again.')
    }
  }

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
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
                name='email'
                value={form.email}
                handleChange={(e:string)=>{setForm({ ...form,email: e}); setErr('')}}
                keyboardType="email-address"
              />
              <FormInput
                name='password'
                value={form.password}
                handleChange={(e:string)=>{setForm({ ...form,password: e});setErr('')}}
                keyboardType="password"
              />
              <View className='w-full flex items-end mt-1'>
                <Link href="/(auth)/forgetPassword" relativeToDirectory style={{color:colors.subText}}>forget password?</Link>
              </View>
              {err && <Text className='text-detail text-red absolute bottom-0'>{err}</Text>}
            </View>

            <View className='flex gap-6 mt-6'>
              <TouchableOpacity onPress={handleSubmit} className='flex flex-row items-center justify-center rounded-full p-1 px-4 bg-primary'>
                <Text className='text-white text-heading2 font-notoMedium'>Login</Text>
              </TouchableOpacity>
              <Text style={{color:colors.subText}}>Or continue with</Text>
              <TouchableOpacity
                onPress={()=> promptAsync()}
                className='flex flex-row items-center justify-center border rounded-full p-2 px-4'
                style={{borderColor:colors.gray}}
              >
                <GoogleIcon width={26} height={26}/>
                <Text style={{color:colors.text}}>Google</Text>
              </TouchableOpacity>
            </View>

            <View className='w-full flex justify-start items-start mt-16'>
              <Text style={{color:colors.subText}}>Don’t you have an account?</Text>
              <Link href="/(auth)/register" relativeToDirectory className='text-primary text-heading2 font-notoSemiBold'>Create your account</Link>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}