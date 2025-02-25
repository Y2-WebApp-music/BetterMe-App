import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../../context/themeContext';
import Modal from './Modal';
import { DayIcon, NightIcon, RightArrowIcon } from '../../constants/icon';
import Svg, { Circle, Defs, Mask, Rect } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

type MorningModalProp = {
  isOpen:boolean
  setIsOpen:(isOpen:boolean) => void
}

const { width } = Dimensions.get('window');
const circle_length = width * 0.8; // Total stroke length
const r = circle_length / (2 * Math.PI); // Adjusted radius for correct scaling

const AnimatedCircle = Animated.createAnimatedComponent(Circle);



const targetValues = [100, 130, 70];
const space = 20;
const easing = Easing.inOut(Easing.quad);



const MorningModal = ({isOpen, setIsOpen}:MorningModalProp) => {

  const { colors } = useTheme();

  const percent = useMemo(() => Math.round((8 / 12) * 100), []);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percent / 100, { duration: 1000 });
  }, [percent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circle_length * (1 - progress.value),
  }));


  const [values, setValues] = useState([0, 0, 0]);
  const setDonutValues = () => setValues(targetValues);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>

      <View style={{backgroundColor:colors.background}} className='p-4 rounded-normal'>
        <View className=' justify-center items-center mb-4'>
          <Text style={{color:colors.primary}} className=' text-subTitle font-notoSemiBold'>Good Morning</Text>
          <Text style={{color:colors.text}} className=' text-heading2 font-notoMedium'>welcome back!</Text>
          <Text style={{color:colors.subText}} className='font-noto'>
            {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
          </Text>
        </View>

        <View className='content-between justify-between gap-2 relative'>


          <View
            style={{transform:[{scale:1.25}]}}
            // style={{transform: [{ translateX: circle_length / 5 }]}}
            className=" justify-center items-center"
          >
            <Svg
              width={circle_length}
              height={circle_length/2}
            >
              <Defs>
                <Mask id="halfMask">
                  <Rect x="0" y="0" width={circle_length} height={circle_length} fill="white" />
                </Mask>
              </Defs>

              <Circle
                cx={circle_length / 2}
                cy={circle_length / 2}
                r={r * 2}
                fill="none"
                stroke={colors.gray}
                strokeWidth={24}
                strokeLinecap="round"
                strokeDasharray={circle_length}
                mask="url(#halfMask)"
                rotation={180}
                translateY={circle_length*0.9}
                translateX={circle_length}
              />
              <AnimatedCircle
                cx={circle_length / 2}
                cy={circle_length / 2}
                r={r * 2}
                fill="none"
                stroke={colors.night}
                strokeWidth={24}
                strokeLinecap="round"
                strokeDasharray={circle_length}
                animatedProps={animatedProps}
                mask="url(#halfMask)"
                rotation={180}
                translateY={circle_length*0.9}
                translateX={circle_length}
              />
            </Svg>
          </View>

          <View
            style={{position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -circle_length / 5 }, { translateY: -circle_length / 5 }]}}
            className='items-center py-2'
          >
            <View style={{transform: [{ translateY: 6 }]}}>
              <Text style={{color:colors.subText}} className='text-heading3'>Total Sleep Time</Text>
            </View>
            <View style={{transform: [{ translateX: 2 }]}} className='flex-row gap-1 items-end'>
              <Text style={{ color: colors.night, fontSize:40 }} className='font-notoMedium'>5</Text>
              <View style={{ transform: [{ translateY: -14 }] }}>
                <Text style={{ color: colors.subText }} className='text-body'>h</Text>
              </View>
              <Text style={{ color: colors.night, fontSize:40 }} className=' font-notoMedium'>21</Text>
              <View style={{ transform: [{ translateY: -14 }] }}>
                <Text style={{ color: colors.subText}} className='text-body'>m</Text>
              </View>
            </View>
            <Text style={{color:colors.subText, transform:[{ translateY: -8 }]}} className=' text-detail'>
            {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(new Date().setDate(new Date().getDate() - 1)))}
            </Text>
          </View>

          <View className=' items-center py-2'>

            <View className='flex-row gap-2'>
              <View style={{justifyContent:'center', backgroundColor:colors.white, borderColor:colors.gray}} className='grow flex flex-row items-center gap-1 p-2 rounded-normal border'>
                <View>
                  <View style={{ transform: [{ translateY: 0 }] }} className='flex flex-row gap-1 items-center'>
                    <NightIcon  width={12} height={12} color={colors.night}/>
                      <Text style={{color:colors.subText}} className=' font-noto'>Sleep</Text>
                  </View>
                  <View style={{ transform: [{ translateX: 4 }] }} className='flex-row gap-1 items-end'>
                    <Text style={{color: colors.subText}} className='text-heading3 '>33:32</Text>
                  </View>
                </View>
              </View>

              <View style={{justifyContent:'center', backgroundColor:colors.white, borderColor:colors.gray}} className='grow flex flex-row items-center gap-1 p-2 rounded-normal border'>
                <View>
                  <View style={{ transform: [{ translateY: 0 }] }} className='flex flex-row gap-1 items-center'>
                    <DayIcon  width={12} height={12} color={colors.yellow}/>
                    <Text style={{color:colors.subText}} className=' font-noto'>Wake Up</Text>
                  </View>
                  <View style={{ transform: [{ translateX: 12 }] }} className='flex-row gap-1 items-end'>
                    <Text style={{color: colors.subText}} className='text-heading3 '>33:32</Text>
                  </View>
                </View>
              </View>
              <View style={{justifyContent:'center', backgroundColor:colors.white, borderColor:colors.gray}} className='grow flex flex-row items-center gap-1 p-2 rounded-normal border'>
                <View>
                  <View style={{ transform: [{ translateY: 3 }] }} className='flex flex-row gap-1 items-center'>
                    <Text style={{color:colors.subText}} className=' font-noto'>Goal Today</Text>
                  </View>
                  <View style={{ transform: [{translateY: -4}] }} className='flex-row gap-1 items-end justify-center'>
                    <Text style={{color: colors.yellow, height:34}} className='text-subTitle font-notoMedium'>4</Text>
                    <Text style={{color: colors.subText}} className='text-heading3 '>goals</Text>
                    {/* <Text style={{color: colors.subText}} className='text-heading3 mt-3'>no goal</Text> */}
                  </View>
                </View>
              </View>
            </View>
          </View>

        </View>

        <View className='flex items-center mt-6 mb-4'>
          <TouchableOpacity onPress={()=>{setIsOpen(false)}} style={{backgroundColor:colors.primary, paddingLeft:30}} className='flex-row gap-2 p-2 px-6 justify-center items-center rounded-full'>
            <Text className='text-heading3 text-white font-notoMedium'>Continue</Text>
            <RightArrowIcon width={20} height={20} color={'#fff'}/>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
});

export default MorningModal