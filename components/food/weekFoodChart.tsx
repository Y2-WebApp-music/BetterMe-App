import { View, Text } from 'react-native'
import React from 'react'
import { BarChart } from 'react-native-gifted-charts'
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

type WeekFoodChartProp = {
  graph:number[]
}
const WeekFoodChart = ({graph}:WeekFoodChartProp) => {

  // const barData = [
  //   {value: 1234, label: 'Mon',labelTextStyle: {color: '#626262'},},
  //   {value:4232, label: 'Tru',labelTextStyle: {color: '#626262'},},
  //   {value:2334, label: 'Wed',labelTextStyle: {color: '#626262'},},
  //   {value: 3231, label: 'Thu',labelTextStyle: {color: '#626262'},},
  //   {value: 2467, label: 'Fri',labelTextStyle: {color: '#626262'},},
  //   {value: 3189, label: 'Sat',labelTextStyle: {color: '#626262'},},
  //   {value: 1869, label: 'Sun',labelTextStyle: {color: '#626262'},},
  // ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // แปลงข้อมูล graph ให้เป็นรูปแบบที่ BarChart ต้องการ
  const barData = graph.map((value, index) => ({
    value: value,
    label: days[index],
    labelTextStyle: { color: '#626262' },
    frontColor: value > 0 ? '#0DC47C' : '#DCDCDC', // สีเทาสำหรับค่าว่าง
  }));

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
        frontColor="#0DC47C"
        data={barData}
        yAxisThickness={0}
        yAxisTextStyle={{ color: '#626262', fontSize: 12, textAlign:'right' }}
        xAxisThickness={1}
        xAxisColor={'#CFCFCF'}
        animationDuration={300}
        isAnimated
        disablePress
      />
    </View>
  )
}

export default WeekFoodChart