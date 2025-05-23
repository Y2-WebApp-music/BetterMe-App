import React from "react";
import { StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedGestureHandler } from "react-native-reanimated";
import { canvas2Polar, Vector } from "react-native-redash";

import { absoluteDuration, angleDiff, CENTER, containedInSquare, normalize, STROKE } from "./Constants";
import CursorOverlay from "./CursorOverlay";

import * as Haptics from 'expo-haptics';

enum Region {
  START,
  END,
  MAIN,
}

interface GestureProps {
  start: Animated.SharedValue<number>;
  end: Animated.SharedValue<number>;
  startPos: Animated.SharedValue<Vector>;
  endPos: Animated.SharedValue<Vector>;
}

const triggerLightHaptics = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
};

const Gesture = ({ start, end, startPos, endPos }: GestureProps) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offset: number; region: Region }
  >({
    onStart: ({ x, y }, ctx) => {
      if (containedInSquare({ x, y }, startPos.value, STROKE)) {
        ctx.region = Region.START;
        ctx.offset = start.value;
      } else if (containedInSquare({ x, y }, endPos.value, STROKE)) {
        ctx.region = Region.END;
        ctx.offset = end.value;
      } else {
        ctx.region = Region.MAIN;
        const { theta } = canvas2Polar({ x, y }, CENTER);
        ctx.offset = theta;
      }
      runOnJS(triggerLightHaptics)();
    },
    onActive: ({ x, y }, ctx) => {
      const { theta } = canvas2Polar({ x, y }, CENTER);
      const delta = theta - ctx.offset;
    
      const newStart = normalize(start.value + delta);
      const startEndDuration = absoluteDuration(newStart, end.value);
    
      if (ctx.region === Region.START || ctx.region === Region.MAIN) {
        if (startEndDuration > 1.6) {
          start.value = newStart;
          ctx.offset = theta;
        }
      }
    
      const newEnd = normalize(end.value + delta);
      const startEndDurationReverse = absoluteDuration(start.value, newEnd);

      console.log('startEndDurationReverse ',startEndDurationReverse);
      
    
      if (ctx.region === Region.END || ctx.region === Region.MAIN) {
        if (startEndDurationReverse > 1.6) {
          end.value = newEnd;
          ctx.offset = theta;
        }
      }
    },
    onEnd: () => {
      runOnJS(triggerLightHaptics)();
    }
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <CursorOverlay position={startPos} icon="moon" />
        <CursorOverlay position={endPos} icon="sunny" />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Gesture;