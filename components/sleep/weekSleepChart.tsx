import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { BarChart } from 'react-native-gifted-charts'

const screenWidth = Dimensions.get('window').width;

const WeekSleepChart = () => {

  const barData = [
    {value: 6.5, label: 'Mon',labelTextStyle: {color: '#626262'},},
    {value: 4, label: 'Tru',labelTextStyle: {color: '#626262'},},
    {value: 5, label: 'Wed',labelTextStyle: {color: '#626262'},},
    {value: 7.8, label: 'Thu',labelTextStyle: {color: '#626262'},},
    {value: 7, label: 'Fri',labelTextStyle: {color: '#626262'},},
    {value: 5.6, label: 'Sat',labelTextStyle: {color: '#626262'},},
    {value: 8, label: 'Sun',labelTextStyle: {color: '#626262'},},
  ];

  const barWidth = screenWidth * 0.08;
  const spacing = 8;
  const totalWidth = barData.length * (barWidth + spacing);
  const chartWidth = Math.min(totalWidth, screenWidth * 0.9);

  return (
    <View style={{ overflow:'hidden'}}>
      <BarChart
        barWidth={screenWidth*0.076}
        noOfSections={3}
        barBorderRadius={6}
        barBorderBottomLeftRadius={0}
        barBorderBottomRightRadius={0}
        spacing={spacing}
        width={chartWidth}
        height={150}
        frontColor="#454AB6"
        data={barData}
        yAxisThickness={0}
        yAxisLabelSuffix='h'
        yAxisTextStyle={{ color: '#626262', fontSize: 12 }}
        xAxisThickness={1}
        xAxisColor={'#CFCFCF'}
        isAnimated
        disablePress
      />
    </View>
  )
}

export default WeekSleepChart