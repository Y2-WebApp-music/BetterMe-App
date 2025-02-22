import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { useTheme } from '../context/themeContext'

type TextInputProp = {
  name:string
  value:number
  handleChange:(text:number) => void
}

const NumberInput:React.FC<TextInputProp> = ({name, value, handleChange}) => {

  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const borderColor = value || isFocused ? colors.primary : colors.gray

  return (
    <View className='w-full mt-2'
      style={{marginTop: 10}}
    >
      <Text style={{color:colors.subText}} className=' text-detail'>{name}</Text>
      <View
        className='w-full flex justify-center border border-gray focus:border-primary rounded-normal'
        style={[
          styles.inputContainer,
          { borderColor },
        ]}
      >
        <TextInput
          className='flex-1 text-primary text-heading2 font-noto text-center'
          style={{
            height: 38,
            width:"94%",
            textAlignVertical: "center",
          }}
          value={value.toString() || ''}
          placeholder={name}
          placeholderTextColor="#CFCFCF"
          onChangeText={(text) => handleChange(Number(text) || 0)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
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

export default NumberInput