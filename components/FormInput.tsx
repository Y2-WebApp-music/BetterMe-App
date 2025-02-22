import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { useTheme } from '../context/themeContext'

type TextInputProp = {
  name:string
  value:string
  handleChange:(text:string) => void
  keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'password'
}

const FormInput:React.FC<TextInputProp> = ({name, value, handleChange, keyboardType}) => {

  const { colors } = useTheme();
  const [showPassword,setShowPassword] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const borderColor = value || isFocused ? colors.primary : colors.gray

  return (
    <View className='w-full'
      style={{marginTop: 6}}
    >
      <View style={{marginBottom: 4}}>
        <Text style={{color:colors.subText}} className=' text-detail'>{name}</Text>
      </View>
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
            // height: 40,
            width:"94%",
            textAlignVertical: "center",
            paddingHorizontal:4,
            paddingVertical:6,
          }}
          value={value}
          placeholder={name}
          placeholderTextColor={colors.darkGray}
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
              color={colors.darkGray}
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