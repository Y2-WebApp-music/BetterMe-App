import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const screenWidth = Dimensions.get('window').width;

const RainbowButton = () => {
  const spinAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the spinning animation
    const spin = Animated.loop(
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 3000, // 5 seconds for a full rotation
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
      <View style={styles.overflow}>
        <Animated.View
          style={[
            styles.borderContainer,
            { transform: [{ rotate }] }, // Spin the border
          ]}
        >
          <LinearGradient
            colors={[
              '#3185F4',
              '#3185F4',
              '#1C60DE',
              '#1C60DE',
              '#9631F4',
              '#9631F4',
              '#9631F4',
              '#9631F4',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          />
        </Animated.View>
      </View>
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text className='font-semibold' style={styles.text}>Auto fill</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#1c1f2b',
  },
  overflow:{
    position:'relative',
    width: screenWidth*0.28,
    height: screenWidth*0.1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden',
  },
  borderContainer: {
    position:'relative',
    width: 200,
    height: 200,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 25,
    borderWidth: 0, // Width of the rainbow border
  },
  button: {
    position: 'absolute',
    width: screenWidth*0.265, // Inner button size
    height: screenWidth*0.085,
    padding:8,
    paddingHorizontal:14,
    borderRadius: 20,
    backgroundColor: '#fbffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    color: '#1C60DE',
    fontWeight: '600',
    fontSize: 18,
    transform:[{translateY:-2}]
  },
});

export default RainbowButton;