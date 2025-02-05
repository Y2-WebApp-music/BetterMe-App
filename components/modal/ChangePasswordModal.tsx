import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import Modal from './Modal'
import { Feather } from '@expo/vector-icons'
import { auth } from '../auth/firebaseConfig'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { useAuth } from '../../context/authContext'

type ChangePasswordModalProp = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const ChangePasswordModal = ({ isOpen, setIsOpen }: ChangePasswordModalProp) => {
  const [step, setStep] = useState(1)
  const [oldPassword, setOldPassword] = useState<string>('')
  const [password, setPassword] = useState({ password: '', confirmPassword: '' })
  const user = auth.currentUser

  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const changePassword = async () => {
  
    if (user) {
      try {
        await updatePassword(user, password.password)
        alert('Password changed successfully!')
        setIsOpen(false)
        handleSignOut()
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          alert('Session expired. Please confirm your current password again.')
          setStep(1)
        } else {
          alert(`Failed to update password: ${error.message}`)
        }
      }
    }
  }

  const handleConfirmPassword = async () => {
    if (oldPassword.trim() === '') {
      alert('Please enter your current password.')
      return
    }
  
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, oldPassword)
  
      try {
        await reauthenticateWithCredential(user, credential)
        setStep(2)
      } catch (error) {
        alert('Incorrect current password. Please try again.')
      }
    }
  }

  const handleSaveNewPassword = () => {
    if (password.password !== password.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    changePassword()
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} withInput={true}>
      <View className='p-2'>
        {step === 1 ? (
          <>
            <Text className='font-noto text-heading2'>Please enter current password</Text>
            <FormInput value={oldPassword} handleChange={setOldPassword} keyboardType='password' />
            <View className='items-center mt-2'>
              <TouchableOpacity onPress={handleConfirmPassword} activeOpacity={0.6} className='p-1 px-6 w-fit rounded-full bg-primary items-center mt-2'>
                <Text className='text-white font-noto text-heading2'>Confirm</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text className='font-noto text-heading2'>New Password</Text>

            <View className='mt-2'>
              <Text className='font-noto text-subText text-detail'>New Password</Text>
            </View>
            <FormInput value={password.password} handleChange={(text) => setPassword((prev) => ({ ...prev, password: text }))} keyboardType='password' />
            <View className='mt-2'>
              <Text className='font-noto text-subText text-detail'>Confirm New Password</Text>
            </View>
            <FormInput value={password.confirmPassword} handleChange={(text) => setPassword((prev) => ({ ...prev, confirmPassword: text }))} keyboardType='password' />
            <View className='items-center mt-2'>
              <TouchableOpacity onPress={handleSaveNewPassword} className='p-2 px-6 w-fit rounded-full bg-primary items-center mt-2'>
                <Text className='text-white text-heading2'>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  )
}

const FormInput = ({ value, handleChange, keyboardType = 'text' }: { value: string; handleChange: (text: string) => void; keyboardType?: 'text' | 'password' }) => {
  const [showPassword, setShowPassword] = useState(false)

  const [isFocused, setIsFocused] = useState<boolean>(false)
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const borderColor = value || isFocused ? '#1C60DE' : '#E8E8E8'


  return (
    <View className='mt-1 w-full flex-row items-center border rounded-normal' style={[styles.inputContainer, { borderColor }]}>
      <TextInput
        className='flex-1 text-primary text-heading2 font-noto'
        style={{
          width: "94%",
          textAlignVertical: "center",
          paddingHorizontal: 4,
          paddingVertical: 6,
        }}
        value={value}
        placeholder={keyboardType === 'password' ? 'Enter password' : 'Enter text'}
        placeholderTextColor="#CFCFCF"
        onChangeText={handleChange}
        secureTextEntry={keyboardType === 'password' && !showPassword}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {keyboardType === 'password' && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#E8E8E8" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 2,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
})

export default ChangePasswordModal
