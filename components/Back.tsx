import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LeftArrowIcon } from '../constants/icon';

const BackButton = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleBackPress} className=" will-change-contents w-fit flex flex-row items-center justify-start">
      <View>
        <LeftArrowIcon width={14} height={14} color={"black"} />
      </View>
      <Text>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;