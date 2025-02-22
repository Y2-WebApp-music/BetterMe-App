import { View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { SearchIcon } from '../constants/icon'
import { useTheme } from '../context/themeContext'


type SearchInputProp = {
  name:string
  value:string
  handleChange:(text:string) => void
}

const SearchInput:React.FC<SearchInputProp> = ({name, value, handleChange}) => {

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const systemTheme = useColorScheme();
  const { theme, colors } = useTheme();

  const borderColor = value || isFocused ? '#1C60DE' : colors.darkGray

  return (
    <View className='w-full'
      style={{marginTop: 6}}
    >
      <View
        className='w-full flex justify-center border focus:border-primary rounded-normal'
        style={[
          styles.inputContainer,
          { borderColor },
        ]}
      >
        <TextInput
          className='flex-1 text-heading2'
          style={{
            height: 40,
            width:"94%",
            textAlignVertical: "center",
            color: theme === "system" ? systemTheme == "dark"?colors.text:colors.primary : theme == "dark"?colors.text:colors.primary
          }}
          value={value}
          placeholder={name}
          placeholderTextColor={colors.subText}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View>
          <SearchIcon color={borderColor}/>
        </View>
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
    borderRadius: 100,
    paddingLeft: 6,
    paddingRight: 6,
    borderWidth: 1,
  },
})

export default SearchInput