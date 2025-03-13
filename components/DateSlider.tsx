import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, isToday } from 'date-fns';
import { useTheme } from '../context/themeContext';

const generateWeeksForMonth = (start: Date, end: Date) => {
  const weeks = [];
  let current = startOfWeek(start, { weekStartsOn: 0 });

  while (current <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current.getTime() + i * 86400000)); // 86400000 ms = 1 day
    }
    weeks.push(week);
    current = addWeeks(current, 1);
  }

  return weeks;
};

type DateSliderProps = {
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  setCurrentMonthYear: (monthYear: string) => void;
};

const DateSlider = ({ selectedDate, setSelectedDate, setCurrentMonthYear }: DateSliderProps) => {

  const { colors } = useTheme();
  const startDate = new Date('2024-12-01');
  const endDate = new Date('2025-05-01');
  const [dates, setDates] = useState(generateWeeksForMonth(startDate, endDate));
  const [currentPage, setCurrentPage] = useState(0);

  const pagerRef = useRef<PagerView>(null);

  // Find the index of the week containing a specific date
  const getWeekIndexForDate = (date: Date): number => {
    for (let i = 0; i < dates.length; i++) {
      const week = dates[i];
      if (week.some((day) => day.toDateString() === date.toDateString())) {
        return i;
      }
    }
    return 0;
  };

  // Scroll to the page containing the selectedDate
  useEffect(() => {
    const pageIndex = getWeekIndexForDate(selectedDate);
    setCurrentPage(pageIndex);
    if (pagerRef.current) {
      pagerRef.current.setPage(pageIndex);
    }
  }, [selectedDate]);

  const handlePageSelected = (e: any) => {
    const page = e.nativeEvent.position;
    setCurrentPage(page);

    const firstDayOfWeek = dates[page][0];
    const monthYear = format(firstDayOfWeek, 'MMMM yyyy');
    setCurrentMonthYear(monthYear);
  };

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 50,
    },
    weekContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 12,
      overflow: 'hidden',
      maxHeight: 50,
    },
    week: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 2,
      width: '100%',
    },
    day: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      backgroundColor: colors.background,
      borderRadius: 9999,
      margin: 2,
    },
    today: {
      backgroundColor: colors.nonFocus,
    },
    todayText: {
      color: 'white',
      fontWeight: 'bold',
    },
    dayText: {
      color: colors.nonFocus,
      fontWeight: 'bold',
    },
    selected: {
      backgroundColor: colors.primary,
    },
  });

  return (
    <PagerView
      style={styles.container}
      ref={pagerRef}
      onPageSelected={handlePageSelected}
      initialPage={currentPage}
    >
      {dates.map((week, index) => (
        <View key={index} style={styles.weekContainer}>
          <View style={styles.week}>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.day,
                  isToday(day) && styles.today,
                  selectedDate && selectedDate.toDateString() === day.toDateString() && styles.selected,
                ]}
                onPress={() => handleDateSelect(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday(day) && styles.todayText,
                    selectedDate && selectedDate.toDateString() === day.toDateString() && styles.todayText,
                  ]}
                >
                  {format(day, 'd')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </PagerView>
  );
};

export default DateSlider;