import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowIcon } from '../constants/icon';

const BackButton = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleBackPress} className="flex flex-row w-[92%] items-center justify-start">
      <View className='rotate-90'>
        <ArrowIcon width={14} height={14} color={"black"} />
      </View>
      <Text>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;