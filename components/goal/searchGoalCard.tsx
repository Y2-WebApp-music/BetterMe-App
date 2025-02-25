import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { SearchGoalCardProp } from '../../types/goal';
import { router } from 'expo-router';
import { useTheme } from '../../context/themeContext';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const circle_length = width * 0.18;
const r = circle_length / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const calculateDuration = (start_date: string | Date, end_date: string | Date) => {
  const start = new Date(start_date);
  const end = new Date(end_date);

  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 30) {
    return `${Math.round(diffInDays)} day`;
  }

  const months = Math.floor(diffInDays / 30);
  const days = Math.round(diffInDays % 30);
  return `${months} month ${days} day`;
};

const SearchGoalCard = ({ goal_id, goal_name, start_date, end_date, total_task, create_by, complete_task }: SearchGoalCardProp) => {

  const { colors } = useTheme();
  const duration = calculateDuration(start_date, end_date);

  const percent = useMemo(() => Math.round((complete_task / total_task) * 100), [complete_task, total_task]);
  const color = percent === 100 ? '#0dc47c' : '#FBA742';
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percent / 100, { duration: 1000 });
  }, [percent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circle_length * (1 - progress.value),
  }));

  return (
    <TouchableOpacity 
      onPress={() => { router.push(`/home/goal/create/${goal_id}`); }} 
      style={{ marginBottom: 8, backgroundColor: colors.background, borderColor: colors.gray }} 
      className='h-32 p-4 w-full justify-center rounded-normal border border-gray flex-row'
    >
      <View style={{ width: '89%', height: '100%' }} className='flex justify-center items-start'>
        <View style={{ width: '100%', height: '70%' }} className='justify-center'>
          <Text
            style={{ overflow: 'hidden', color: colors.text }}
            numberOfLines={2}
            ellipsizeMode="tail"
            className='font-noto text-heading2 line-clamp-2'
          >
            {goal_name}
          </Text>
        </View>
        <Text style={{ color: colors.subText }} className='text-detail font-noto'>create by : {create_by}</Text>
        <Text style={{ color: colors.subText }} className='text-detail font-noto'>{total_task} Task duration : {duration}</Text>
      </View>

      <View style={{ width: '10%', height: '100%' }} className='justify-center items-center'>
        <Svg width={circle_length} height={circle_length} viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke={colors.gray}
            strokeWidth="10"
            fill="none"
          />
          <AnimatedCircle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circle_length}
            animatedProps={animatedProps}
          />
          <Text style={{color:color}} className=' absolute text-heading font-notoSemiBold'>{percent}%</Text>
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

export default SearchGoalCard;
