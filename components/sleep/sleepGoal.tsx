import { View, Text, Animated, TouchableWithoutFeedback, Easing } from 'react-native'
import React, { useRef, useState } from 'react'
import { DayIcon, NightIcon } from '../../constants/icon'
import { StyleSheet } from 'react-native'

const SleepGoal = () => {

  const [toggle, setToggle] = useState(false)

  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleToggle = () => {
    setToggle(!toggle);

    Animated.timing(animatedValue, {
      toValue: toggle ? 0 : 1,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

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
    <View style={{paddingHorizontal:20, backgroundColor:'white' }} className='h-28 w-full rounded-normal border border-gray p-2 justify-center items-center flex-row gap-2'>
      <NightIcon width={36} height={36} color={'#454AB6'}/>

      <View style={{paddingLeft:10}} className='grow'>
        <View style={{ transform: [{ translateY: 8 }] }}>
          <Text className='text-subText font-noto'>Sleep time</Text>
        </View>
        <View className='flex-row gap-1 items-end'>
          <Text style={{color:'#454ab6'}} className='text-title font-notoMedium'>3</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text className='text-subText'>h</Text>
          </View>
          <Text style={{color:'#454ab6'}} className='text-title text-night font-notoMedium'>33</Text>
          <View style={{ transform: [{ translateY: -10 }] }}>
            <Text className='text-subText'>m</Text>
          </View>
        </View>
      </View>

      <View style={{ transform: [{ translateY: 8 }] }} className=' relative flex-col justify-center items-center'>

      <TouchableWithoutFeedback onPress={handleToggle}>
        <Animated.View
            style={[
              styles.container,
              { backgroundColor },
            ]}
          >
            <Animated.View
              style={[
                styles.round,
                {
                  transform: [{ translateX }],
                  width:roundWidth,
                },
              ]}
            >
              {toggle ? (
                <NightIcon width={20} height={20} color={'#454AB6'} />
              ) : (
                <DayIcon width={20} height={20} color={'#fba742'} />
              )}
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
        {toggle?(
          <Text className='font-noto text-subText text-detail'>Sleeping</Text>
        ):(
          <Text className='font-noto text-subText text-detail'>Waking</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    width:78,
    height:36,
    backgroundColor:'#e8e8e8',
    borderRadius:100,
    padding:4,
    display:'flex',
    justifyContent:'center',
    alignItems:'flex-start',

  },
  round:{
    width:30,
    height:30,
    borderRadius:50,
    backgroundColor:'#fff',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  }
})

export default SleepGoal