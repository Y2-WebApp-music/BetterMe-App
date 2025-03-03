import React, { ComponentProps } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Vector } from "react-native-redash";
import { FontAwesome, Ionicons as Icon } from "@expo/vector-icons";

import { STROKE } from "./Constants";
import { useTheme } from "../../../context/themeContext";

interface CursorOverlayProps {
  position: Animated.SharedValue<Vector>;
  icon: ComponentProps<typeof Icon>["name"];
}

const CursorOverlay = ({ position, icon }: CursorOverlayProps) => {

  const { colors } = useTheme();

  const style = useAnimatedStyle(() => {
    const { x, y } = position.value;
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: STROKE,
      height: STROKE,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      transform: [
        { translateX: x - STROKE / 2 },
        { translateY: y - STROKE / 2 },
      ],
    };
  });
  return (
    <Animated.View style={style}>
      <Icon name={icon} color={colors.night} size={24} />
    </Animated.View>
  );
};

export default CursorOverlay;