import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;
type RainbowButtonProp = {
  handleClick?:()=>void
  text:string
  active:boolean
}

const RainbowButton = ({handleClick, text, active}:RainbowButtonProp) => {
  const spinAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the spinning animation
    const spin = Animated.loop(
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 2000, // 2 seconds for a full rotation
        easing: Easing.linear, // Ensures smooth and continuous animation
        useNativeDriver: true, // For better performance
      })
    );

    spin.start();

    // Clean up animation on unmount
    return () => spin.stop();
  }, [spinAnimation]);

  // Interpolating the rotation of the gradient
  const rotate = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {active?(
        <View style={styles.overflow}>
          <Animated.View
            style={[
              styles.borderContainer,
              { transform: [{ rotate }] }, // Spin the border
            ]}
          >
            <LinearGradient
              colors={['#3185F4','#3185F4','#1C60DE','#1C60DE','#9631F4','#9631F4','#9631F4','#9631F4',]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorder}
            />
          </Animated.View>
        </View>
      ):(
        <View style={styles.overflow}>
          <View style={[styles.borderContainer]}/>
        </View>
      )}
      <TouchableOpacity onPress={handleClick} disabled={!active} style={styles.button} activeOpacity={0.7}>
        <View style={{transform:[{translateY:1}]}}>
          <Text className='font-notoSemiBold' style={[styles.text,{color: active? '#1C60DE': '#CFCFCF'}]}>{text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    alignContent:'flex-end',
  },
  overflow:{
    position:'relative',
    width: screenWidth*0.45,
    height: screenWidth*0.084,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden',
  },
  borderContainer: {
    position:'relative',
    width: screenWidth*4,
    height: screenWidth*0.1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#e8e8e8'
  },
  gradientBorder: {
    position: 'absolute',
    width: screenWidth*0.5,
    height: screenWidth*1,
    borderRadius: 9999,
    borderWidth: 0, // Width of the rainbow border
  },
  button: {
    position: 'absolute',
    width: screenWidth*0.44, // Inner button size
    height: screenWidth*0.075,
    // padding:8,
    paddingHorizontal:14,
    borderRadius: 9999,
    backgroundColor: '#fbffff',
    opacity:0.9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontWeight: '500',
    fontSize: 15,
  },
});

export default RainbowButton;