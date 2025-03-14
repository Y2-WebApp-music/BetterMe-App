import { View, Text, TextInput, StyleSheet, useColorScheme, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { CloseIcon, SearchIcon } from '../constants/icon'
import { useTheme } from '../context/themeContext'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { Dimensions } from 'react-native'
import * as Haptics from 'expo-haptics';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type SearchInputProp = {
  search:string
  setSearch:(comment:string) => void
  setFocus:(focus:boolean) => void
  setClear:(clear:boolean) => void
  submit: () => void
}

const screenWidth = Dimensions.get('window').width;

const SearchInput:React.FC<SearchInputProp> = ({search, setSearch, setFocus, submit, setClear}) => {

  const { colors } = useTheme();

  const triggerMediumHaptics = async () => {
    search === '' && await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  };

  const triggerSuccessHaptics = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  };

  const defaultWidth = screenWidth * 0.96;
  const expandedWidth = screenWidth * 0.80;

  const inputWidth = useSharedValue(defaultWidth);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);

  const animatedIn = () => {
    inputWidth.value = withTiming(expandedWidth, { duration: 200 });
    buttonOpacity.value = withTiming(1, { duration: 200 });
    buttonScale.value = withSpring(1);
  }
  const animatedOut = () => {
    inputWidth.value = withTiming(defaultWidth, { duration: 200 });
    buttonOpacity.value = withTiming(0, { duration: 200 });
    buttonScale.value = withSpring(0.8);
  }

  const handleTextChange = (text: string) => {
    animatedIn()
    setFocus(true)
    setSearch(text);
  };

  const onFocus = () => {
    setFocus(true)
    animatedIn()
  }
  const onBlur = () => {
    setFocus(false)
    animatedOut()
  }

  const animatedInputStyle = useAnimatedStyle(() => ({
    width: inputWidth.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const handleClear = useCallback(async () => {
    setClear(false)
    setSearch('')
  }, []);

  const handleCancel = useCallback(async () => {
    animatedOut()
    setFocus(false)
    setClear(false)
    setSearch('')
    triggerSuccessHaptics()
  }, [search]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, width:"100%",alignItems:'center', position:'relative' }}
    >
    <View className='w-full'>
        <View className='w-full flex-row gap-1 items-center justify-center p-1 px-2'>
          <View style={{flex:1}}>
            <View className="flex-row gap-1">
              <Animated.View style={animatedInputStyle}>
                <View style={[styles.input,{backgroundColor: colors.white, borderColor: colors.gray,}]}
                  className='flex-row items-center w-full'
                >
                  <View style={{width:'9%'}}>
                    <FontAwesome6 name="magnifying-glass" size={24} color={colors.darkGray}/>
                  </View>
                  <TextInput
                    style={{color: colors.text, width:'84%'}}
                    className='font-noto text-body'
                    placeholder="search..."
                    value={search}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onPress={triggerMediumHaptics}
                    onChangeText={handleTextChange}
                    keyboardType='web-search'
                    onSubmitEditing={submit}
                  />
                  {search &&
                    <TouchableOpacity onPress={handleClear} activeOpacity={0.4} style={{width:'9%'}}>
                      <CloseIcon height={24} width={24} color={colors.darkGray}/>
                    </TouchableOpacity>
                  }
                </View>
              </Animated.View>
              <Animated.View style={[animatedButtonStyle,{justifyContent:'center'}]}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={[styles.icon]}
                  onPress={handleCancel}
                >
                  <Text className='text-primary font-notoMedium text-heading3'>cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    width: screenWidth * 0.11,
    height: screenWidth * 0.11,
    alignContent: 'center',
  },
  input: {
    borderRadius: 99,
    padding: 8,
    borderWidth: 1,
  },
  icon: {
    width:'100%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:4,
    paddingHorizontal:5
  },
});

export default SearchInput