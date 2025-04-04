import { View, Text, Animated, TouchableWithoutFeedback, Easing } from 'react-native';
import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { DayIcon, NightIcon } from '../../constants/icon';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../context/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInMinutes, format, isAfter, setHours, setMinutes, setSeconds } from 'date-fns';
import axios from 'axios';
import { sleepCard } from '../../types/sleep';
import { SERVER_URL } from '@env';
import { userEvent } from '@testing-library/react-native';
import { useAuth } from '../../context/authContext';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';

type SleepGoalProp = {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  sleepTime: { hours: number; minutes: number };
  setSleepTime: (time: { hours: number; minutes: number }) => void;
};

const SleepGoal = ({toggle, setToggle, sleepTime, setSleepTime}:SleepGoalProp) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const existingTime = await AsyncStorage.getItem('sleepData');

        setToggle(!!existingTime);
        
      } catch (error) {
        console.error('Error checking sleepData:', error);
      }
    };
    checkStorage();
  }, []);

  const animatedValue = useRef(new Animated.Value(toggle ? 1 : 0)).current;

  const triggerMediumHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: toggle ? 1 : 0,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [toggle]);

  const handleToggle = useCallback(async () => {
    try {
      setToggle((prev) => {
        const newState = !prev;
        return newState;
      });
      
      const sleepDuration = await toggleSleep(user?._id || '', !toggle);

      triggerMediumHaptics()
  
      if (sleepDuration) {
        setSleepTime({
          hours: Math.floor(sleepDuration.total_time / 60),
          minutes: sleepDuration.total_time % 60,
        });
      } else {
        setSleepTime({ hours: 0, minutes: 0 });
      }
    } catch (error) {
      console.error('Error toggling sleep:', error);
    }
  }, [user,toggle]);

  const [displayToggle, setDisplayToggle] = useState(true)

  useFocusEffect(
    useCallback(() => {
      console.log('sleep Goal useCallback');
  
      const getSleepData = async () => {
        try {
          const sleepRecordsString = await AsyncStorage.getItem('sleepRecords');
          const sleepRecords = sleepRecordsString ? JSON.parse(sleepRecordsString) : [];
      
          if (sleepRecords.length !== 0) {
            const reset = await resetIfNeeded();

            if (reset){
              setSleepTime({
                hours: 0,
                minutes: 0,
              });
            }
            
            setSleepTime({
              hours: Math.floor(sleepRecords[0].total_time / 60 || 0),
              minutes: sleepRecords[0].total_time % 60 || 0,
            });
            const resetTime = setHours(setMinutes(setSeconds(new Date(), 0), 0), 18);
            console.log(isAfter(new Date(), resetTime));
            
            isAfter(new Date(), resetTime) ? setDisplayToggle(true) : setDisplayToggle(false)
            !isAfter(new Date(), resetTime) && setToggle(false)
          }

        } catch (error) {
          console.error('Error fetching sleep data:', error);
        }
      };
      getSleepData()
    }, [])
  );

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
          <Text style={{ color: colors.subText }} className='font-noto'>{displayToggle ? 'Sleep time':'last night'}</Text>
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

      {displayToggle ? (
        <View style={{ transform: [{ translateY: 8 }] }} className='relative flex-col justify-center items-center'>
          <TouchableWithoutFeedback testID="toggle-button" onPress={handleToggle}>
            <Animated.View style={[styles.container, { backgroundColor }]}>
              <Animated.View style={[styles.round, { transform: [{ translateX }], width: roundWidth }]}>
                {toggle ? (
                  <NightIcon width={20} height={20} color={colors.night} />
                  // <Text>NightIcon</Text>
                ) : (
                  // <Text>DayIcon</Text>
                  <DayIcon width={20} height={20} color={colors.yellow} />
                )}
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
          <Text style={{ color: colors.subText }} className='font-noto text-detail'>{toggle ? 'Sleeping' : 'Waking'}</Text>
        </View>
      ):(
        <View>
          <Text style={{color:colors.subText}} className='font-noto text-heading3'>
            {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(new Date().setDate(new Date().getDate() - 1)))}
          </Text>
        </View>
      )}
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
    console.log('==== Sleep data reset ====');
    return true
  }
  return false
};

export const toggleSleep = async (user: string, isToggled: boolean): Promise<sleepCard | null> => {
  await resetIfNeeded();

  console.log('isToggled ',isToggled);
  
  const existingTime = await AsyncStorage.getItem('sleepData');
  console.log('Existing sleepData:', existingTime && new Date(existingTime).toLocaleString());

  if (!existingTime && isToggled) {
    await AsyncStorage.setItem('sleepData', new Date().toISOString());
    console.log('==> Started sleep tracking. <==');
    return null;
  }

  if (existingTime && !isToggled) {
    const startTime = new Date(existingTime);
    const endTime = new Date();
    const sleepDuration = differenceInMinutes(endTime, startTime);
    console.log('Start Time:', startTime.toLocaleString());
    console.log('End Time:', endTime.toLocaleString());
    console.log('Calculated Sleep Duration:', sleepDuration);

    if (sleepDuration < 120 || sleepDuration > 780) {
      console.log('Invalid sleep duration:', sleepDuration);
      await AsyncStorage.removeItem('sleepData');
      console.log('- Return NULL -');
      return null;
    }

    const validSleepTime = sleepDuration - 30;
    if (validSleepTime < 90) {
      console.log('Valid sleep time too short after excluding first 30 minutes.');
      await AsyncStorage.removeItem('sleepData');
      console.log('- Return NULL -');
      return null;
    }

    console.log('Final Valid Sleep Time:', validSleepTime);

    const isSameDay = startTime.toDateString() === endTime.toDateString();
    const isLateNight = startTime.getHours() >= 0 && startTime.getHours() < 6;

    let sleepDate = (isSameDay && isLateNight)
      ? new Date(startTime.setDate(startTime.getDate() - 1))
      : new Date(startTime);

    sleepDate.setUTCHours(0, 0, 0, 0);


    const utcPlus7 = new Date(sleepDate);
    utcPlus7.setHours(utcPlus7.getHours() + 7);

    if (utcPlus7.getHours() >= 0 && utcPlus7.getHours() < 6) {
      sleepDate.setUTCDate(sleepDate.getUTCDate() + 1);
    }

    const newRecord: sleepCard = {
      total_time: validSleepTime,
      sleep_date: sleepDate.toISOString(),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      create_by: user
    };

    console.log(`Valid sleep recorded: ${Math.floor(validSleepTime / 60)}h ${validSleepTime % 60}m`);

    console.log('removeItem sleepData ');
    await AsyncStorage.removeItem('sleepData');

    console.warn('Post Sleep Time to DB \n')
    const response = await postDB(newRecord);
    console.log('return newRecord');

    return response;
  }

  console.log('- Final Return NULL -');
  return null;
};

const postDB = async (newRecord:sleepCard) => {
  try {
    const response = await axios.post(`${SERVER_URL}/sleep/create`, newRecord);

    const data = response.data

    if (data.message === "Create sleep success") {
      console.log('Create sleep success');
      console.log('data.sleep',data.sleep);

      console.log('will store in AsyncStorage sleepRecords');
      const existingRecords = await AsyncStorage.getItem('sleepRecords');
      const records: sleepCard[] = existingRecords ? JSON.parse(existingRecords) : [];
      records.push(data.sleep);
      await AsyncStorage.setItem('sleepRecords', JSON.stringify(records));

      return data.sleep
    }

  } catch(error) {
    console.error(error)
  }
}

export default SleepGoal;