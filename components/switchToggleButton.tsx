import { TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { useTheme } from '../context/themeContext';

interface ToggleButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, isActive, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} className={`p-1 px-4 ${isActive ? 'bg-primary' : 'bg-transparent'} rounded-normal`}>
      <Text style={{ color: isActive ? '#fff' : colors.subText }} className='text-heading3 font-notoMedium'>{label}</Text>
    </TouchableOpacity>
  );
};

export default ToggleButton;
