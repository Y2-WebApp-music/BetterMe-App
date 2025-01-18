import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons'

type TextInputProp = {
  name:string
  value:string
  handleChange:(text:string) => void
  keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'password'
}

const FormInput:React.FC<TextInputProp> = ({name, value, handleChange, keyboardType}) => {

  const [showPassword,setShowPassword] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const borderColor = value || isFocused ? '#1C60DE' : '#E8E8E8'

  return (
    <View className='w-full'
      style={{marginTop: 6}}
    >
      <Text className='text-subText text-detail'>{name}</Text>
      <View
        className='w-full flex justify-center border border-gray focus:border-primary rounded-normal'
        style={[
          styles.inputContainer,
          { borderColor },
        ]}
      >
        <TextInput
          className='flex-1 text-primary text-heading2 font-noto'
          style={{
            height: 40,
            width:"94%",
            textAlignVertical: "center",
          }}
          value={value}
          placeholder={name}
          placeholderTextColor="#CFCFCF"
          onChangeText={handleChange}
          secureTextEntry={keyboardType === 'password' && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {keyboardType === 'password' && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#E8E8E8"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 12,
    paddingLeft: 4,
    paddingRight: 4,
    borderWidth: 1,
  },
})

export default FormInput