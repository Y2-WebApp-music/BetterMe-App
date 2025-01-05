import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from "react";
import { Calendar, toDateId, CalendarTheme } from "@marceloterreiro/flash-calendar";
import { ArrowIcon, BackwardIcon, ForwardIcon } from '../../../constants/icon';

const MonthCalendar = () => {

  const today = toDateId(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(toDateId(new Date()));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleString("en-US", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
      <View className='w-full relative px-2 h-auto mt-3 flex-row items-center'>
        <View className={`absolute top-3 left-4 border ${selectedDate === today?'border-primary':'border-gray'} p-1 px-2 rounded-normal`}>
          <TouchableOpacity onPress={goToToday}>
            <Text
              className={`text-body font-noto ${
                selectedDate === today ? 'text-primary' : 'text-subText'
              }`}
            >
              Today
            </Text>
          </TouchableOpacity>
        </View>
        <View className='grow flex-row gap-4 items-center justify-center'>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <BackwardIcon color={'#1C60DE'}/>
          </TouchableOpacity>
          <View className="w-[26vw] flex-col justify-center items-center">
            <Text className="text-heading2 font-notoMedium">{monthName}</Text>
            <Text className="text-body text-nonFocus">{year}</Text>
          </View>
          <TouchableOpacity onPress={goToNextMonth}>
            <ForwardIcon color={'#1C60DE'}/>
          </TouchableOpacity>
        </View>
        <View className='absolute top-3 right-2 p-1 px-2 rounded-normal flex-row gap-1 items-center'>
          <Text className='text-subText font-noto text-body'>Month</Text>
          <ArrowIcon width={16} height={16} color={'#626262'}/>
        </View>
      </View>
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ transform: [{ translateY: -24 }] }} className="flex gap-2 items-center">
            <View className='h-[38vh]'>
              <Calendar
                calendarActiveDateRanges={[
                  {
                    startId: selectedDate,
                    endId: selectedDate,
                  },
                ]}
                calendarFirstDayOfWeek="sunday"
                calendarDayHeight={40}
                calendarRowVerticalSpacing={10}
                onCalendarDayPress={setSelectedDate}
                calendarMonthId={toDateId(currentMonth)}
                theme={linearTheme}
              />
            </View>
            <View className='flex justify-center items-center'>
              <View className='bg-nonFocus h-1 w-[20vw] rounded-full'></View>
            </View>
          </View>
          <View style={{ transform: [{ translateY: -18 }] }} className='flex-col gap-2'>
            <Text className='font-noto text-heading3'>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedDate))}</Text>
            <View className='h-28 w-full rounded-normal border border-gray bg-white'></View>
            <View className='h-28 w-full rounded-normal border border-gray bg-white'></View>
            <Text className='text-subText font-noto'>Meal in this day</Text>
            <View className='h-28 w-full rounded-normal border border-gray bg-white'></View>
            <View className='h-28 w-full rounded-normal border border-gray bg-white'></View>
            <View className='h-28 w-full rounded-normal border border-gray bg-white'></View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const linearAccent = "#1C60DE";

const linearTheme: CalendarTheme = {
  rowMonth: {
    content: {
      textAlign: "left",
      color: "rgba(0, 0, 0, 1)",
      fontWeight: "700",
      display:'none'
    },
  },
  itemWeekName: { content: { color: "#B8C2D2" } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: linearAccent,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? linearAccent : "transparent",
        borderRadius: 12,
      },
      content: {
        color: isWeekend && !isPressed ? "rgba(0, 0, 0, 1)" : "#000",
        fontSize:14,
        fontWeight:600,
        fontFamily:'noto-sans-thai'
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: "rgba(0, 0, 0, 0)",
        borderRadius: isPressed ? 12 : 12,
        backgroundColor: isPressed ? linearAccent : "#B8C2D2",
      },
      content: {
        color: isPressed ? "#000" : "rgba(255, 255, 255, 1)",
        fontSize:16,
        fontWeight:600,
        fontFamily:'noto-sans-thai'
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }) => ({
      container: {
        backgroundColor: linearAccent,
        borderTopLeftRadius: isStartOfRange ? 16 : 0,
        borderBottomLeftRadius: isStartOfRange ? 16 : 0,
        borderTopRightRadius: isEndOfRange ? 16 : 0,
        borderBottomRightRadius: isEndOfRange ? 16 : 0,
      },
      content: {
        color: "#ffffff",
      },
    }),
  },
};

export default MonthCalendar