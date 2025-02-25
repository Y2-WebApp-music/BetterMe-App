import { View, Text, Animated, TouchableWithoutFeedback, Easing } from 'react-native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DayIcon, NightIcon } from '../../constants/icon';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../context/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInMinutes, format, isAfter, setHours, setMinutes, setSeconds } from 'date-fns';
import axios from 'axios';
import { sleepCard } from '../../types/sleep';
import { SERVER_URL } from '@env';

const SleepGoal = () => {
  const { colors } = useTheme();

  const [toggle, setToggle] = useState(false);
  const [sleepTime, setSleepTime] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    async function checkStorage() {
      const existingTime = await AsyncStorage.getItem('sleepData');
      setToggle(!!existingTime);
    }
    checkStorage();
  }, []);

  const animatedValue = useRef(new Animated.Value(toggle ? 1 : 0)).current;

  useEffect(() => {
    console.log('Sleep toggle', toggle);
  }, [toggle]);

  const handleToggle = useCallback(async () => {
    if (toggle) {
      const sleepDuration = await toggleSleep();
      if (sleepDuration) {
        setSleepTime({
          hours: Math.floor(sleepDuration / 60),
          minutes: sleepDuration % 60,
        });
      }
    } else {
      await toggleSleep();
      setSleepTime({ hours: 0, minutes: 0 });
    }
    
    setToggle((prev) => !prev);
    Animated.timing(animatedValue, {
      toValue: toggle ? 0 : 1,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [toggle]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fba742', '#454AB6'],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [2, 0, 40, 38],
  });

  const roundWidth = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [30, 36, 30],
  });

  return (
    <View style={{ paddingHorizontal: 20, backgroundColor: colors.white, borderColor: colors.gray }} className='h-28 w-full rounded-normal border p-2 justify-center items-center flex-row gap-2'>
      <NightIcon width={36} height={36} color={colors.night} />

      <View style={{ paddingLeft: 10 }} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text style={{ color: colors.subText }} className='font-noto'>Sleep time</Text>
        </View>
        <View className='flex-row gap-1 items-end'>
          <Text style={{ color: colors.night }} className='text-title font-notoMedium'>{sleepTime.hours}</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text style={{ color: colors.subText }}>h</Text>
          </View>
          <Text style={{ color: colors.night }} className='text-title font-notoMedium'>{sleepTime.minutes}</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text style={{ color: colors.subText }}>m</Text>
          </View>
        </View>
      </View>

      <View style={{ transform: [{ translateY: 8 }] }} className='relative flex-col justify-center items-center'>
        <TouchableWithoutFeedback onPress={handleToggle}>
          <Animated.View style={[styles.container, { backgroundColor }]}>
            <Animated.View style={[styles.round, { transform: [{ translateX }], width: roundWidth }]}>
              {toggle ? (
                <NightIcon width={20} height={20} color={colors.night} />
              ) : (
                <DayIcon width={20} height={20} color={colors.yellow} />
              )}
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
        <Text style={{ color: colors.subText }} className='font-noto text-detail'>{toggle ? 'Sleeping' : 'Waking'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 78,
    height: 36,
    borderRadius: 100,
    padding: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  round: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const resetIfNeeded = async () => {
  const lastReset = await AsyncStorage.getItem('lastResetTime');
  const resetTime = setHours(setMinutes(setSeconds(new Date(), 0), 0), 18);

  if (!lastReset || isAfter(new Date(), resetTime)) {
    await AsyncStorage.removeItem('sleepRecords');
    await AsyncStorage.setItem('lastResetTime', new Date().toISOString());
    console.log('Sleep data reset at 18:00');
  }
};

export const toggleSleep = async (): Promise<number | null> => {
  await resetIfNeeded();

  const existingTime = await AsyncStorage.getItem('sleepData');

  if (!existingTime) {
    await AsyncStorage.setItem('sleepData', new Date().toISOString());
    return null;
  } else {
    const startTime = new Date(existingTime);
    const endTime = new Date();
    const sleepDuration = differenceInMinutes(endTime, startTime);

    if (sleepDuration < 120 || sleepDuration > 780) {
      console.log('Invalid sleep duration:', Math.floor(sleepDuration / 60), 'hours');
      await AsyncStorage.removeItem('sleepData');
      return null;
    }

    const validSleepTime = sleepDuration - 30;
    if (validSleepTime < 90) {
      console.log('Valid sleep time too short after excluding first 30 minutes.');
      await AsyncStorage.removeItem('sleepData');
      return null;
    }

    const newRecord: sleepCard = {
      total_time: validSleepTime,
      date: format(new Date(), 'yyyy-MM-dd'),
      start_time: format(startTime, 'HH:mm'),
      end_time: format(endTime, 'HH:mm'),
    };

    const existingRecords = await AsyncStorage.getItem('sleepRecords');
    const records: sleepCard[] = existingRecords ? JSON.parse(existingRecords) : [];
    records.push(newRecord);
    await AsyncStorage.setItem('sleepRecords', JSON.stringify(records));

    console.log(`Valid sleep recorded: ${Math.floor(validSleepTime / 60)}h ${validSleepTime % 60}m`);

    const hourNow = new Date().getHours();
    if (hourNow >= 6 && hourNow <= 12) {
      // await axios.post(`${SERVER_URL}/sleep/createSleep`, newRecord);
      console.warn('Post Sleep Time to DB \n', newRecord)
    }

    await AsyncStorage.removeItem('sleepData');
    return validSleepTime;
  }
};

export default SleepGoal;