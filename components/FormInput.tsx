import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

type TextInputProp = {
  name:string
  value:string
  handleChange:(text:string) => void
  keyboardType:string
}

const FormInput:React.FC<TextInputProp> = ({name,value,handleChange,keyboardType}) => {

  const [showPassword,setShowPassword] = useState<boolean>(false)

  return (
    <View className='space-y-2 h-auto w-full'>
      <Text className='text-subText text-detail'>{name}</Text>
      <View className='w-full h-32 border border-gray focus:border-primary rounded-normal'>
        <TextInput
          className='flex-1 text-primary h-12 text-2xl'
          value={value}
          placeholder={name}
          placeholderTextColor="#E8E8E8"
          onChangeText={handleChange}
          secureTextEntry={keyboardType === 'password' && !showPassword}
        />
      </View>
    </View>
  )
}

export default FormInput