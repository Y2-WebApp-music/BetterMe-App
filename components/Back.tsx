import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LeftArrowIcon } from '../constants/icon';
import { router } from 'expo-router';

type BackButtonProp = {
  goto:string
}

const BackButton = ({goto}:BackButtonProp) => {

  return (
    <TouchableOpacity onPress={()=>{router.back()}} className='will-change-contents w-fit flex flex-row items-center justify-start'>
      <View>
        <LeftArrowIcon width={14} height={14} color={"black"} />
      </View>
      <Text>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;