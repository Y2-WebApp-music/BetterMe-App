import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import Modal from './Modal'
import { Feather } from '@expo/vector-icons'

type ChangePasswordModalProp = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const ChangePasswordModal = ({ isOpen, setIsOpen }: ChangePasswordModalProp) => {
  const [step, setStep] = useState(1)
  const [oldPassword, setOldPassword] = useState<string>('')

  const [password, setPassword] = useState({
    password: '',
    confirmPassword: ''
  })

  const handleConfirmPassword = () => {
    setStep(2)
  }

  const handleSaveNewPassword = () => {
    if (password.password !== password.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    alert('Password changed successfully!')
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} withInput={true}>
        <View className='p-2'>
          {step === 1 ? (
            <>
              <View className='w-full items-center'>
                <Text className='font-noto text-heading2'>Please enter current password</Text>
              </View>
              <View className='mt-2'>
                <Text className='font-noto text-subText text-detail'>Password</Text>
              </View>
              <FormInput value={oldPassword} handleChange={setOldPassword} keyboardType="password" />

              <View className='items-center mt-2'>
                <TouchableOpacity onPress={handleConfirmPassword} activeOpacity={0.6} className='p-1 px-6 w-fit rounded-full bg-primary items-center mt-2'>
                  <Text className='text-white font-noto text-heading2'>Confirm</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setStep(1)}>
                <Text className='text-red'>Back</Text>
              </TouchableOpacity>

              <View className='w-full items-center'>
                <Text className='font-noto text-heading2'>New Password</Text>
              </View>

              <View className='mt-2'>
                <Text className='font-noto text-subText text-detail'>New Password</Text>
              </View>
              <FormInput
                value={password.password}
                handleChange={(text) => setPassword((prev) => ({ ...prev, password: text }))}
                keyboardType="password"
              />
              
              <View className='mt-2'>
                <Text className='font-noto text-subText text-detail'>Confirm New Password</Text>
              </View>
              <FormInput
                value={password.confirmPassword}
                handleChange={(text) => setPassword((prev) => ({ ...prev, confirmPassword: text }))}
                keyboardType="password"
              />

              <View className='items-center mt-2'>
                <TouchableOpacity onPress={handleSaveNewPassword} activeOpacity={0.6} className='p-1 px-6 w-fit rounded-full bg-primary items-center mt-2'>
                  <Text className='text-white font-noto text-heading2'>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
  )
}

type TextInputProp = {
  value: string
  handleChange: (text: string) => void
  keyboardType?: 'text' | 'password'
}

const FormInput = ({ value, handleChange, keyboardType = 'text' }: TextInputProp) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingLeft: 4,
    paddingRight: 4,
    borderWidth: 1,
  },
})

export default ChangePasswordModal