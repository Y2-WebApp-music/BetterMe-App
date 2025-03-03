import { Dimensions } from "react-native";
import { Vector } from "react-native-redash";

const { width } = Dimensions.get("window");
export const PADDING = 24;
export const SIZE = width - PADDING * 3.5;
export const STROKE = 50;
export const R = (SIZE - STROKE) / 2;
export const { PI } = Math;
export const TAU = 2 * PI;
export const CENTER = { x: SIZE / 2, y: SIZE / 2 };

export const containedInSquare = (
  value: Vector,
  center: Vector,
  side: number
) => {
  "worklet";
  const topLeft = { x: center.x - side / 2, y: center.y - side / 2 };
  return (
    value.x >= topLeft.x &&
    value.y >= topLeft.y &&
    value.x <= topLeft.x + side &&
    value.y <= topLeft.y + side
  );
};

export const normalize = (value: number) => {
  "worklet";
  const rest = value % TAU;
  
  return rest > 0 ? rest : TAU + rest;
};

export const absoluteDuration = (start: number, end: number) => {
  "worklet";
  
  return start > end ? end + (TAU - start) : end - start;
};

export const radToMinutes = (rad: number) => {
  "worklet";
  const minutes = ((rad - PI / 2 + TAU) % TAU) * (24 * 60) / TAU;
  
  return minutes;
};

export const preFormatDuration = (raw: number) => {
  "worklet";

  const duration = Math.round((1440 - raw) % 1440);
  
  const hours = Math.floor(duration / 60);
  const minutes =  Math.round(duration % 60);
  
  return { hours, minutes };
};

export const formatDuration = (duration: number) => {
  "worklet";
  const { hours, minutes } = preFormatDuration(duration);
  return `${("" + hours).padStart(2, "0")}:${("" + minutes).padStart(2, "0")}`;
};
export const formatDuration2 = (duration: number) => {
  "worklet";
  const { hours, minutes } = preFormatDuration(duration);
  return `${hours} h ${minutes} m`;
};

export const formatDurationHour = (duration: number) => {
  "worklet";
  const { hours } = preFormatDuration(duration);
  return `${hours}`;
};
export const formatDurationMinute = (duration: number) => {
  "worklet";
  const { minutes } = preFormatDuration(duration);
  return `${minutes}`;
};

export const arc = (x: number, y: number, large = false, sweep = false) => {
  "worklet";
  return `A ${R} ${R} 0 ${large ? "1" : "0"} ${sweep ? "1" : "0"} ${x} ${y}`;
};