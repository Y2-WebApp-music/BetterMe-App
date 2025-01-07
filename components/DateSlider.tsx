import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { subDays, addDays, startOfWeek, addWeeks, addDays as addDaysToDate, format } from 'date-fns';
import PagerView from 'react-native-pager-view';

const generateDates = (start: Date, end: Date, weekStartsOn: number) => {
  const getStartOfWeek = (date: Date): Date => startOfWeek(date, { weekStartsOn });

  let current = getStartOfWeek(start);
  const weekStartDates: Date[] = [];

  while (current <= end) {
    weekStartDates.push(current);
    current = addWeeks(current, 1);
  }

  const allWeeks = weekStartDates.map((weekStart) => {
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(addDaysToDate(weekStart, i));
    }
    return weekDays;
  });

  return allWeeks;
};

const dates = generateDates(
  subDays(new Date(), 14),
  addDays(new Date(), 14),
  0
);

const DateSlider = () => {
  return (
    <PagerView style={styles.container} orientation="horizontal">
      {dates.map((week, i) => (
        <View key={i} style={styles.page}>
          <View style={styles.row}>
            {week.map((day, j) => (
              <View key={j} style={styles.day}>
                <Text className='text-white'>{format(day, 'EEE')}</Text>
                <Text className='text-white'>{day.getDate()}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  day: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    backgroundColor:'#1C60DE',
    color:'white',
    borderRadius:12,

  },
});

export default DateSlider;