import React, { ComponentProps } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import Animated, { useDerivedValue } from "react-native-reanimated";
import { ReText } from "react-native-redash";

import { formatDuration, radToMinutes } from "./Constants";
import { useTheme } from "../../../context/themeContext";

interface LabelProps {
  theta: Animated.SharedValue<number>;
  label: string;
  icon: ComponentProps<typeof Icon>["name"];
  iconColor: string
}

const Label = ({ theta, label, icon, iconColor }: LabelProps) => {

  const { colors } = useTheme();

  const time = useDerivedValue(() => {
    const minutes = radToMinutes(theta.value);
    
    return formatDuration(minutes);
  });

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
    },
    row: {
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
    },
    time: {
      color: colors.subText,
      fontSize: 24,
    },
    label: {
      fontSize: 13,
      color:colors.subText
    },
  });

  const iconColors = iconColor == "night" ? colors.night: colors.yellow

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon name={icon} size={20} color={iconColors} />
        <Text style={styles.label}>{"\u00A0" + label}</Text>
      </View>
      <ReText style={styles.time} text={time} />
    </View>
  );
};

export default Label;