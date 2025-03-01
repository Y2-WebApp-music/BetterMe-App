import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { SearchGoalCardProp } from '../../types/goal';
import { router } from 'expo-router';
import { useTheme } from '../../context/themeContext';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const circle_length = width * 0.48;
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
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity onPress={() => { router.push(`/home/goal/${goal_id}`); }} 
        style={{ marginBottom: 8, backgroundColor: colors.background, borderColor: colors.gray, alignSelf: 'center', marginHorizontal: 'auto', width: '96%' }} 
        className='h-32 justify-center items-center rounded-normal border border-gray flex-row'>
        <View style={{ width: '75%', height: '100%', paddingLeft: 2 }} className='justify-center'> 
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
          <Text style={{ color: colors.subText, marginLeft: 2 }} className='text-xs font-noto'>create by : {create_by}</Text>
          <Text style={{ color: colors.subText, marginLeft: 2 }} className='text-xs font-noto'>{total_task} Task duration : {duration}</Text>
        </View>

        <View className='justify-center items-center'>
          <Svg width={circle_length/2.8} height={circle_length/2.8} style={{ transform: [{ rotate: '270deg' }] }} >
            <Circle
              cx={circle_length/5.6}
              cy={circle_length/5.6}
              r={r}
              fill="#E8E8E8"
              stroke={'#E8E8E8'}
              strokeWidth={6}
            />
            <AnimatedCircle
              cx={circle_length/5.6}
              cy={circle_length/5.6}
              r={r}
              fill="#E8E8E8"
              stroke={color}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circle_length}
              animatedProps={animatedProps}
            />
            <Circle
              cx={circle_length/5.6}
              cy={circle_length/5.6}
              r={r-5}
              fill={colors.background}
              stroke='none'
            />
          </Svg>
          <Text style={{color:color}} className='absolute text-heading font-notoSemiBold'>{percent}%</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchGoalCard;

