import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LeftArrowIcon } from '../constants/icon';
import { router } from 'expo-router';
import { useTheme } from '../context/themeContext';
import * as Haptics from 'expo-haptics';
import { runOnJS } from 'react-native-reanimated';

type BackButtonProp = {
  goto?:string
}

const BackButton = ({goto}:BackButtonProp) => {

  const { colors } = useTheme();

  const triggerMediumHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    console.log('Haptics triggered');
  };

  return (
    <TouchableOpacity onPress={()=>{runOnJS(triggerMediumHaptics);router.back()}} className='will-change-contents w-fit flex flex-row items-center justify-start'>
      <View>
        <LeftArrowIcon width={14} height={14} color={colors.text} />
      </View>
      <Text style={{color:colors.text}}>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;