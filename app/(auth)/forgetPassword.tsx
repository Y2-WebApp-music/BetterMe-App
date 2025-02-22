import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../../components/Back'
import FormInput from '../../components/FormInput'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../components/auth/firebaseConfig'
import Modal from '../../components/modal/Modal'
import { router } from 'expo-router'
import { useTheme } from '../../context/themeContext'

const forgetPassword = () => {

  const { colors } = useTheme();
  const [email, setEmail] = useState('')
  const [sended, setSended] = useState(false)
  const [err, setErr] = useState('')

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handlePasswordReset = () => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.")
      setErr("Please enter a valid email address.")
      return;
    }
    
    sendPasswordResetEmail(auth, email)
    .then(() => {
      // alert("Password reset email sent!");
      setSended(true)
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
      setErr(error.message)
      });
  };

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-start items-center font-noto">
      <View className='w-[92%] flex items-start mt-4'>
        <BackButton goto={'/welcome'}/>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width:"100%",alignItems:'center' }}
      >
        <ScrollView
          className='w-[92%] h-full'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          showsVerticalScrollIndicator={false}
        >
          <View className='w-full h-[24vh] justify-center'>
            <Text className='text-[40px] text-primary font-notoMedium'>Better Me</Text>
            <Text className='text-heading2 text-primary font-noto -translate-y-2'>ชีวิตดีๆที่ลงตัว</Text>
          </View>

          <View className='w-full mt-10' style={{paddingBottom: 20}} >
            <Text className='text-heading text-primary font-notoMedium'>Forget password?</Text>

            <View className='mt-4'>
              <FormInput name={'email'} value={email} handleChange={(e:string)=>setEmail(e)} keyboardType={'email-address'}/>
            </View>
            {err? (
              <Text className='text-detail text-red font-noto mt-2'>{err}</Text>
            ):(
              <Text style={{color:colors.subText}} className='text-detail font-notoLight mt-2'>please give an email, we will send link to reset your password to your email</Text>
            )}

            <View className='w-full flex-row p-1 justify-center mt-8'>
              <TouchableOpacity onPress={handlePasswordReset} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
                <Text className='w-fit text-white text-heading2 font-notoMedium'>Send</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
        <Modal isOpen={sended} setIsOpen={setSended}>
          <View style={{backgroundColor:colors.white}} className= 'w-full h-fit p-4 rounded-normal'>
            <View className='w-full items-start justify-center flex gap-2'>
                <Text style={{color:colors.green}} className='text-heading mt-2'>Password reset email sent!</Text>
                <Text style={{color:colors.subText}} className=' font-notoLight'>Please follow step in email and back to login</Text>
            </View>
            <View className='mt-4 w-full items-end justify-end flex-row gap-4'>
              <TouchableOpacity style={{backgroundColor:'#1c60de'}} onPress={()=>{setSended(false); router.back();}} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-primary'>
                <Text className='w-fit text-white text-heading2 font-notoMedium'>back to home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
    
  )
}

export default forgetPassword